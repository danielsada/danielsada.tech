import React from 'react'
import projects from '../data/projects.js'
import ProjectCard from './ProjectCard'

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

export default class ProjectDashboard extends React.Component{
    render(){
      let listaProjectos = projects;
      let mappedProjects = listaProjectos.map((project)=>{
        return <ProjectCard key={project.name} {...project}/>
      });
      let columns = divide(mappedProjects,3);
      let htmlColumns = columns.map((x,i)=>{
        return <div className="column" key={i}>
          {x}
        </div>
      });
      return <div className="columns container">
        {htmlColumns}
        </div>
    }
  }