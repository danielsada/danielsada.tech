+++
title = "Part 6: How OneNote Storage works, in-depth"
description = "Part 6 of my software journey, my depth phase."
tags = [
    "technical",
    "onenote"
]
date = "2025-04-20"
categories = [
    "career",
    "leadership"
]
series = ["My career so far"]

+++

### The In-Between: From Founder to Employee

After I got my full time offer in Microsoft, I sold my company and moved to work full-time on Microsoft OneNote. I also took time to travel through South America and explore Mexico. 

Being in those months is like a limbo, expectant of something new coming, yet agressively trying to live in the present. Nevertheless, I started at Microsoft as a Software Engineer. 

## OneNote Services

All of the things I'll list below, can be obtained in full detail in the [.one](https://msopenspecs.microsoft.com/files/MS-ONE/%5bMS-ONE%5d.pdf) file spec and the following presentations and threads [1](https://old.reddit.com/r/OneNote/comments/551wbj/desperate_letter_to_onenote_team_how_could_you/d8h0zce/) [2](https://www.youtube.com/watch?v=nO0sGRH95Sg) [3](https://old.reddit.com/r/OneNote/comments/6q3ipk/how_does_onenote_syncing_work/dkuiyxs/) and [4](https://techcommunity.microsoft.com/blog/microsoft_365blog/what%E2%80%99s-coming-to-onenote/2612960).

I started at the OneNote Sync and Storage team. This team has the job of storing notes from the moment you type them to the moment you save them in the back-end. In this case, the backend was a .one file in Sharepoint or OneDrive.

To appreciate the technical challenges we faced, it helps to understand how OneNote actually stores information. Most users think of OneNote as a simple hierarchical structure:
```
Notebook
  └── Section
       └── Page
            └── Content (text, images, drawings, etc.)
```

But the reality was significantly more complex. Each notebook is actually a container for multiple .one files, with each section being a separate file. The pages themselves are stored within these section files using a proprietary binary format that captures not just content, but spatial relationships, revision history, and collaboration metadata.

Here's a simplified view of how it actually worked:
```
Notebook (folder structure, but actually a "notebook" .one file)
  ├── .onetoc2 (per-folder TOC files)
  ├── Section1.one (binary file)
  │    ├── Page1 (binary chunk with revision store)
  │    │    ├── Text (binary chunk with formatting)
  │    │    ├── Images (binary chunks with metadata)
  │    │    └── Ink (binary chunks with stroke data)
  │    └── Page2 (binary chunk)
  ├── Section2.one (binary file)
  │    ├── Page3 (binary chunk)
  │    └── Page4 (binary chunk)
  ├── _private (folder for private sections)
  │    └── PrivateSection.one
```

The .onetoc2 file was the fast-cache of the entire system, essentially the "file system within a file system." It contains. metadata about every section in the notebook (names, colors, order).

The TOC was designed to load extremely quickly, allowing the OneNote client to display the notebook structure even before all the section files were downloaded. This was critical for large notebooks that might contain hundreds of sections and thousands of pages.

When a user made changes to the notebook structure (like reordering sections), we only needed to update the TOC file rather than moving actual section files, making these operations nearly instantaneous. Deffering asynchronously the actual color change inside the .one.

## Page and Section Data Structures
Internally, each .one file was an elaborate data structure combining:

- Trees to store the relationship of Sections, Pages etc. 
- Custom revision store that maintained a full history of changes. 
- Layout data for the "canvas" nature of pages
- A binary blob database for images and rich media content (not to duplicate images and content, which are very heavy).

## Permissions and Sharing Model

OneNote's permission model was particularly complex because it needed to integrate with the underlying storage backends (SharePoint and OneDrive) while providing granular section-level access control:

- Notebook-level permissions inherited from the container (SharePoint site or OneDrive folder)
- Section-level permissions that could further restrict access
- Password-protected sections that used client-side encryption (AES-128)

The sharing implementation was complicated by the fact that SharePoint and OneDrive had different permission models, and we needed a unified abstraction layer.

## Data Residency and Compliance
A critical aspect of OneNote's storage architecture that added significant complexity was ensuring data residency compliance. Enterprise customers, particularly in regulated industries and government sectors, had strict requirements about where their data could physically reside:

- **Geo-fencing requirements:** Many countries required that data for their government or regulated industries (healthcare, finance) must remain within their geographical boundaries.
- **Data sovereignty guarantees:** Some customers required contractual assurances that their data would never leave specific jurisdictions, even for processing or backup purposes.
- **On-premise support:** Many businesses have an on-premises version of SharePoint and OneNote had to support those, even if the networking, latency or firewalls weren't the best.

## Backend Storage Constraints
The choice of SharePoint and OneDrive as storage backends created several important constraints. I'm not sure how these have evolved over the years since I've left Microsoft.

**SharePoint constraints:**

- File size limits - Earlier versions of SharePoint had a 2GB file size limit, which limited efficiency on real time collabs once you started to hit that point.
- Path length restrictions - Total URL path couldn't be too long. (The real art was surfacing that to the user.)
- Throughput throttling - SharePoint would throttle excessive API calls

**OneDrive Constraints:**

- Quota limits - Users had storage quotas that notebooks counted against
- Sync prioritization - OneDrive had its own sync engine with different priorities than OneNote's
- Offline file access - Coordinating between OneDrive's offline files and OneNote's was challenging

## The Sync Challenge: Merging Multiple Realities
The most fascinating technical challenge was sync (or real time editing). When a user edits a notebook on multiple devices: perhaps typing on their phone while on the subway, then adding an image from their laptop at home, we needed to merge these changes seamlessly.

This wasn't simple text diffing. We were dealing with:

- **Spatial conflicts:** What happens when two users move the same text box to different locations?
- **Semantic conflicts:** How do you merge when one user changes text while another formats it?
- **Cross-platform variations:** Each client platform (Windows, Mac, iOS, Android, Web) had different capabilities and rendering engines.
- **Offline edits:** Changes might sit on a device for days before reconnecting to sync.

A particularly sophisticated aspect of OneNote's architecture was our differential sync engine. Unlike many sync systems that simply replace entire files, OneNote needed to track and merge changes at a much more granular level.

Each OneNote section file maintained its own revision store, a specialized data structure that tracked every change to every element on every page:
```
SectionFile
  └── RevisionStore
       ├── RevisionManifest (tracks overall revision sequence)
       ├── RevisionChain (per-element revision history)
       │    ├── ElementID1: Rev1 → Rev2 → Rev3 → ...
       │    ├── ElementID2: Rev1 → Rev4 → ...
       │    └── ...
       └── ContentChunks (actual binary deltas i.e. images)
            ├── Chunk1 (compressed binary delta)
            ├── Chunk2 (compressed binary delta)
            └── ...
```

When a user made changes to a page, the client would:

- Identify exactly which elements changed
- Calculate the minimal binary delta for each change
- Compress these deltas
- Package the changes with metadata about the base revision that the delta was applied to.

For text elements, we used a modified diff-match-patch algorithm to represent changes. For binary elements like images, we stored binary blobs with unique identifiers, eliminating the need to copy images repeatedly.

The collaborative merge algorithm would:

- Identify the common ancestor revision where the changes diverged
- Apply a "three-way merge" comparing base, local, and server versions
- Intelligently resolve non-conflicting changes (e.g., changes to different properties)
- Create explicit conflict records when automatic merging wasn't possible
- Generate a new merged revision that combined compatible changes

This sophisticated differential sync system was at the heart of OneNote's ability to support complex collaborative scenarios while maintaining performance and reliability even in challenging network conditions.

## The Evolution to "Modern Sync"
While I was at Microsoft, one of the most significant architectural transitions we worked on was moving from the traditional SharePoint-based "Cobalt" sync protocol to what we called "Modern Sync." This represented a fundamental shift in how OneNote handled synchronization.

### The Legacy Cobalt Protocol

The original sync mechanism relied on SharePoint's "Cobalt" protocol, which was essentially REST-based file operations. This system had several limitations:

- **Polling-based:** Clients had to regularly check for changes, creating unnecessary network traffic
- **HTTP overhead:** Each sync operation required multiple HTTP requests with authentication overhead
- **Backend coupling:** Tight integration with SharePoint made cross-platform support challenging
- **Latency:** The protocol wasn't optimized for real-time collaboration experiences
- **Special casing for OneDrive:** OneDrive/Consumer had a lot of unique edge cases as it was developed later.

### Modern Sync

"Modern Sync" represented a complete re-architecture of OneNote's synchronization approach:

### WebSocket Connections

Persistent connections replaced the polling-based mechanisms of the legacy system. This enabled true bi-directional communication, allowing for real-time updates between clients and servers. The WebSocket protocol significantly reduced overhead for authentication and connection establishment since a single connection could remain open for extended periods, eliminating the need to repeatedly poll with each sync operation.

### True Differential Sync

Instead of exchanging entire file chunks as in the old system, changes were now transmitted as granular operations. The system could handle precise instructions like "insert text at position X in page A" or "move element Y to position Z in Page B" rather than replacing entire sections of content. This approach greatly reduced bandwidth requirements, especially for large notebooks where even minor changes previously required substantial data transfers.

### Centralized Conflict Resolution

With Modern Sync, the server became the definitive source of truth for conflict resolution. Operational transforms were applied server-side using sophisticated algorithms that preserved user intent across multiple simultaneous edits. Clients received pre-resolved changes, eliminating the complex reconciliation processes that previously had to happen on each device.

### Backend Independence
 
The new protocol abstracted away from SharePoint-specific implementation details, creating a more flexible synchronization layer. This enabled consistent behavior regardless of whether notebooks were stored in OneDrive, SharePoint, or potentially other future backend systems. As a result, cross-platform experiences became more uniform, reducing the fragmentation that had previously existed between different OneNote clients.

This came with a set of technical challenges though, 

### Backward Compatibility

The system needed to support both protocols simultaneously during the transition period. Legacy clients still needed to work seamlessly with content that had been modified using the Modern Sync protocol. This required developing a sophisticated "bridge" between the two protocols that could translate operations back and forth, ensuring that no matter which client edited a notebook, the changes would be visible to all users regardless of which sync protocol their client implemented.

Downgrades and upgrades (from Cobalt, to Modern Sync) and viceversa, were very closely tracked for compatibility.

### State Verification

With differential sync, ensuring consistency between client and server states became significantly more complex. We developed a "rolling hash" mechanism that could efficiently verify alignment between client and server states without transferring complete content. Additionally, the system performed periodic full-state comparisons that served as consistency checkpoints to prevent small discrepancies from accumulating over time. This hybrid approach balanced efficiency with reliability.

### Reconnection Strategies

WebSocket connections could drop unexpectedly, especially on mobile networks with variable connectivity. The system needed sophisticated reconnection logic with intelligent operation queuing to handle these scenarios gracefully. Clients maintained a queue of pending operations when offline and negotiated the proper resumption point when reconnecting. This ensured that work continued locally during connectivity gaps and synchronized correctly when connection was restored, without requiring users to manually intervene.

## The Artisan Mindset: Depth Over Breadth

This was a brutal team to join as a new grad. You needed to understand deeply the call stacks for three different operating systems, C++, C#, the intricacies of file systems, binary serialization formats, and distributed systems concepts: all while working with legacy code that had evolved over 15+ years.

What made this period of my career unique was the transition from the breadth required as an entrepreneur to the depth required as a specialized engineer. I began to appreciate the craftsperson approach to software: diving deep into a complex system, understanding its inner workings, and learning to make precise changes with minimal disruption.

The OneNote codebase contained millions of lines of code written over more than a decade. Some modules were literally older than my programming career. I learned to approach this legacy code with respect rather than frustration, understanding that each seemingly strange pattern or workaround likely addressed a real-world problem that wasn't immediately obvious.

I remember one senior developer showing me a seemingly simple 20-line function that, as he explained its history, turned out to have been rewritten eight times over the years to address various edge cases, performance issues, and cross-platform inconsistencies. What looked like a straightforward task was actually a carefully balanced solution to multiple competing constraints.

I found an unexpected satisfaction in this invisible craftsmanship. The feedback loop was longer, but the impact was arguably larger: millions of people relying on our code to protect their ideas, research, and memories.