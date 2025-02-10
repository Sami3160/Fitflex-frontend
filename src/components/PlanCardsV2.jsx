import React from 'react';
import './PlanCardsV2.css'
import styled from 'styled-components';
import green from '../assets/green.png'
import red from '../assets/red.png'
import yellow from '../assets/yellow.png'
import Button from './StyledButton'
import like from '../assets/like.png'

import liked from '../assets/liked.png'
const PlansCardV2 = ({ info }) => {
  const difficultyMap = {
    "Beginner": (<img width="24" height="20" src={green} alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab" />),
    "Intermidiate": (<img width="24" height="20" src={yellow} alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab" />),
    "Advanced": (<img width="24" height="20" src={red} alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab" />)
  }
  // console.log(info)
  return (
    <div className="card">
      <div className="top-section">
        <div className="border2" />
        <img height={150} src={info?.imageUrl} className='banner' />
        <div className="icons">
          <div className="logo"></div>

          <div className="social-media">

            {difficultyMap[info?.level]}

            <img width="21" height="20" style={{ cursor: "pointer" }} className='svg' src={like} alt="like--v1" />
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <span className="title">{info?.name}</span>
        <center>

        <Button message={"Start"} url={`plans/workouts/${info?._id}/overview`} data={info}/>
        </center>
        <div className="row row1">
          <div className="item">
            <span className="big-text">{info?.level}</span>
            <span className="regular-text">Difficulty</span>
          </div>
          <div className="item">
            <span className="big-text">0%</span>
            <span className="regular-text">Completed</span>
          </div>
          <div className="item">
            <span className="big-text">0</span>
            <span className="regular-text">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansCardV2;

