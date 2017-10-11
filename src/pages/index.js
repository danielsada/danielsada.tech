import React from 'react'
import Link from 'gatsby-link'
import projects from '../data/projects.js'
import ProjectDashboard from '../components/ProjectDashboard'
import Hero from '../components/Hero'

function aggregateTechnologies(){
  let returnDictionary = {};
  for(let element of projects){
    for(let techs of element.technologies){
      returnDictionary[techs] = true;
    }
  }
  console.log("ret",returnDictionary);
  return returnDictionary;
}

class IndexPage extends React.Component {

render(){
  let elements = ['a','b','c','d','e','f'];
 let techs = aggregateTechnologies();
 let spans = [];
 for (let tech in techs){
  spans.push(<span className='tag is-large is-primary'>{tech}</span>)
}
return <div>
  <div className="hero panoramic">
  </div>
  <Hero title='Daniel Sada Caraveo' 
  subtitle='Computing Engineer, coffee enthusiast, life-long learner and curious. Trying to save years of human life.'/>
  <div className='section'>
    <h1 className='is-1 title'>Skills</h1>
      <div className='tags'>
        { spans }
      </div>
    </div>
  <Hero title='Projects contributed or created' subtitle='This are some of the things I have done in the past'/>
  <div className='section'>
    <h1 className='is-1 title'>Contributions</h1>
 <ProjectDashboard/>
  </div>
  <Hero title='This website was constructed in React and Gatsby with Bulma' subtitle=''/>
 </div>
}
}

export default IndexPage
