import React from 'react'

const Hero = ({title, subtitle}) =>(
<div className="hero-body background-brand">
    <p className="title is-3 white">
     {title}
    </p>
    <p className="subtitle is-4 white">
    {subtitle}
    </p>
  </div>
)

export default Hero