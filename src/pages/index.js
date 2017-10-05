import React from 'react'
import Link from 'gatsby-link'
import projects from './projects.js'

function divide(arr,n){
  let arrays = Array(n);
  for (let i = 0; i < arrays.length; i++) {
    arrays[i] = Array(); 
  }

  for (let i = 0; i < arr.length; i++) {
    arrays[i%n].push(arr[i]);
  }
  return arrays;
}


class ProjectCard extends React.Component{
  render(){
    return <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img src="http://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image"/>
      </figure>
    </div>
    <div className="card-content">
      <div className="media">
        <div className="media-content">
          <p className="title is-4">{this.props.name}</p>
          <p className="subtitle is-6">@johnsmith</p>
        </div>
      </div>
      <div className="content">
        {this.props.description}<br/> {this.props.technologies.map((tech)=>{
          return <a>#{tech}</a>
        })} 
        <br/>
        <time dateTime={this.props.date}>{this.props.date}</time>
      </div>
    </div>
  </div>



  }
}

class ProjectDashboard extends React.Component{
  render(){
    let listaProjectos = projects;
    let mappedProjects = listaProjectos.map((project)=>{
      return <ProjectCard key={project.name} {...project}/>
    });
    let columns = divide(mappedProjects,3);
    console.log(columns);
    let htmlColumns = columns.map((x,i)=>{
      return <div className="column" key={i}>
        {x}
      </div>
    });
    console.log(mappedProjects)
    return <div className="columns">
      {htmlColumns}
      </div>
  }
}


class IndexPage extends React.Component {

render(){
  let elements = ['a','b','c','d','e','f'];
 

return <div>
  <div className="hero panoramic">
  </div>
  <div className="hero-body background-brand">
    <p className="title is-3 white">
      Daniel Sada Caraveo
    </p>
    <p className="subtitle is-4 white">
      Computing Engineer, coffee enthusiast, life-long learner and curious. Trying to save years of human life.
    </p>
  </div>
  <div>
    <h1 style={{margin:'20px'}}>Contributions</h1>
 <ProjectDashboard/>

  </div>



 </div>
}
}

export default IndexPage
