import React from 'react';
import './PlanCardsV2.css'
import styled from 'styled-components';

const PlansCardV2 = ({info}) => {
    const difficultyMap={
        "Beginnner":(<img width="16" height="16" src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/53/external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab.png" alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab"/>),
        "Intermidiate":(<img width="16" height="16" src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/53/external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab.png" alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab"/>),
        "Advanced":(<img width="16" height="16" src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/53/external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab.png" alt="external-Bicep-health-care-and-medical-vectorslab-glyph-vectorslab"/>)
    }
  return (
      <div className="card">
        <div className="top-section">
          <div className="border" />
          <div className="icons">
            <div className="logo">
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 94" className="svg">
                <path fill="white" d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z" />
                <path fill="white" d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z" />
                <path fill="white" d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z" />
              </svg> */}
            </div>
            <div className="social-media">
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="svg">
                <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
              </svg>
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg> */}
              {difficultyMap[info?.level]}
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
              </svg>
              <img width="15" height="15" src="https://img.icons8.com/ios/50/like--v1.png" alt="like--v1"/>
            </div>
          </div>
        </div>
        <div className="bottom-section">
          <span className="title">{info?.name}</span>
          <div className="row row1">
            <div className="item">
              <span className="big-text">2626</span>
              <span className="regular-text">UI elements</span>
            </div>
            <div className="item">
              <span className="big-text">0%</span>
              <span className="regular-text">Completed</span>
            </div>
            <div className="item">
              <span className="big-text">38,631</span>
              <span className="regular-text">Contributers</span>
            </div>
          </div>
        </div>
      </div>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 270px;
    height:370px;
    border-radius: 20px;
    background: #1b233d;
    padding: 5px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card .top-section {
    height: 150px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(45deg, rgb(4, 159, 187) 0%, rgb(80, 246, 255) 100%);
    position: relative;
  }

  .card .top-section .border {
    border-bottom-right-radius: 10px;
    height: 30px;
    width: 130px;
    background: white;
    background: #1b233d;
    position: relative;
    transform: skew(-40deg);
    box-shadow: -10px -10px 0 0 #1b233d;
  }

  .card .top-section .border::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    right: -15px;
    background: rgba(255, 255, 255, 0);
    border-top-left-radius: 10px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0;
    background: rgba(255, 255, 255, 0);
    height: 15px;
    width: 15px;
    border-top-left-radius: 15px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section .icons {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
  }

  .card .top-section .icons .logo {
    height: 100%;
    aspect-ratio: 1;
    padding: 7px 0 7px 15px;
  }

  .card .top-section .icons .logo .top-section {
    height: 100%;
  }

  .card .top-section .icons .social-media {
    height: 100%;
    padding: 8px 15px;
    display: flex;
    gap: 7px;
  }

  .card .top-section .icons .social-media .svg {
    height: 100%;
    fill: #1b233d;
  }

  .card .top-section .icons .social-media .svg:hover {
    fill: white;
  }

  .card .bottom-section {
    margin-top: 15px;
    padding: 10px 5px;
  }

  .card .bottom-section .title {
    display: block;
    font-size: 17px;
    font-weight: bolder;
    color: white;
    text-align: center;
    letter-spacing: 2px;
  }

  .card .bottom-section .row {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .card .bottom-section .row .item {
    flex: 30%;
    text-align: center;
    padding: 5px;
    color: rgba(170, 222, 243, 0.721);
  }

  .card .bottom-section .row .item .big-text {
    font-size: 12px;
    display: block;
  }

  .card .bottom-section .row .item .regular-text {
    font-size: 9px;
  }

  .card .bottom-section .row .item:nth-child(2) {
    border-left: 1px solid rgba(255, 255, 255, 0.126);
    border-right: 1px solid rgba(255, 255, 255, 0.126);
  }`;

export default PlansCardV2;

