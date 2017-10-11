import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'


import '../css/bulma.css'
import '../css/index.css'
import '../css/fa.min.css'

const NavBarItems = (props) => {
    let link;
    if(props.ext){
      link = <a href={props.url}>{props.name}</a>
    } else {
      link = <Link to={props.url}>{props.name}</Link>
    }
    return <div className='navbar-item'>
      {link}
    </div>
}


class Header extends React.Component {
  render(){
  var navigation =[{  
    url:'/',
    name:'Home',
    ext:false
  },{
    url:'http://blog.posthaven.com',
    name:'Blog',
    ext:true
  },  ] 
  return (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link
        to="/" className="navbar-item logosada">
       danielsada.mx
      </Link>
      <a className="navbar-item is-hidden-desktop" href="https://github.com/danielsada">
          <span className="icon" style={{"color": "#333"}}>
            <i className="fa fa-lg fa-github"></i>
          </span>
        </a>

        <a className="navbar-item is-hidden-desktop" href="https://www.linkedin.com/in/danielsadac/">
          <span className="icon" style={{"color": "#55acee"}}>
            <i className="fa fa-lg fa-linkedin"></i>
          </span>
        </a>
      <div className="navbar-burger burger" data-target="showmenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>
    <div className="navbar-menu" id='showmenu'>
      <div className="navbar-start">
       

        
      </div>
      <div className="navbar-end">
      <a className="navbar-item is-hidden-desktop-only" href="https://github.com/danielsada/" target="_blank">
        <span className="icon" style={{"color": "#333"}}>
          <i className="fa fa-lg fa-github"></i>
        </span>
      </a>
      <a className="navbar-item is-hidden-desktop-only" href="https://www.linkedin.com/in/danielsadac/" target="_blank">
        <span className="icon" style={{"color": "#55acee"}}>
          <i className="fa fa-lg fa-linkedin"></i>
        </span>
      </a>
        {navigation.map((x)=>{return <NavBarItems key={x.url} url={x.url} name={x.name} ext={x.ext} />})  }
      </div>
    </div>
  </nav>
  )
}
}

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Daniel Sada Caraveo | Software Engineer | MX "
      meta={[
        { name: 'description', content: 'Daniel Sada Caraveo is a Software Developer, Computer Engineer who studies in Monterrey Tech. He is the Co-Founder of Sadeira.' },
        { name: 'keywords', content: 'daniel sada caraveo, daniel sada, software developer, portfolio, tec de monterrey, microsoft' },
      ]}
    />
    

    <Header />
    <div className='content'>
      {children()}
    </div>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-43424010-7"></script>
    <script async src="/img/navbarScript.js"></script>
<script>

</script>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
