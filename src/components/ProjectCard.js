import React from 'react'
export default class ProjectCard extends React.Component{
    
     render(){
       let mediaContent;
       if(typeof this.props.imgurl !== 'undefined'){
         mediaContent = <div className="card-image">
         <figure className="image is-4by3">
           <img src={__PATH_PREFIX__ + '/img/'+this.props.imgurl+'.png'} alt={this.props.name}/>
         </figure>
       </div>
       }
   
       return <div className="card">
       {mediaContent}
       <div className="card-content">
         <div className="media">
           <div className="media-content">
             <p className="title is-4">{this.props.name}</p>
             <p className="subtitle is-6">{this.props.subtitle}</p>
           </div>
         </div>
         <div className="content">
           {this.props.description}<br/> {this.props.technologies.map((tech)=>{
             return <a key={tech}>#{tech} </a>
           })} 
           <br/><br/>
           <a className="sitelink" style={{float:'right', color:'#ccc',display:'inline-block', height:'30px'}} href={this.props.url}> Link to Site </a>
           <br/>
         </div>
       </div>
     </div>
     }
   }