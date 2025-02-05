// this component is temperary and will be replaced with the actual workout and exercise components

import { Grid, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import PlansCard from "../components/PlansCard";
import plansObject from "../data/plans.json";
import axios from 'axios'
const URL = import.meta.env.VITE_API_URL;

function Plans({ mode, textcolor }) {
  const [workouts, setWorkouts] = useState({});
  useEffect(() => {
    document.title = "FitFlex-Know Your Plans";
    const fetchWorkouts=async()=>{
      try {
        const response=await axios.get(`${URL}/api/workouts/workouts`)
        setWorkouts(response.data.data)
        // console.log(response.data.data)
        
      } catch (error) {
       console.error(error) 
      }
    }
    fetchWorkouts()

  }, []);
  
  const [isLogged, setLogged] = useState(false);
  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      price: "Rs 9.99",
      image: "triceps",
      features: ["Access to basic workouts", "Limited support"],
    },
    {
      id: 2,
      name: "Premium Plan",
      price: "Rs 19.99",
      image: "triceps",
      features: ["Access to premium workouts", "24/7 support"],
    },
    {
      id: 3,
      name: "Pro Plan",
      price: "Rs 29.99",
      image: "triceps",
      features: ["Access to all workouts", "Personal trainer support"],
    },
    {
      id: 3,
      name: "Pro Plan",
      price: "Rs 29.99",
      image: "triceps",
      features: ["Access to all workouts", "Personal trainer support"],
    },
    {
      id: 4,
      name: "Pro Plan",
      price: "Rs 29.99",
      image: "triceps",
      features: ["Access to all workouts", "Personal trainer support"],
    },
    {
      id: 5,
      name: "Pro Plan",
      price: "Rs 29.99",
      image: "triceps",
      features: ["Access to all workouts", "Personal trainer support"],
    },
  ];

  return (
    <Box
      sx={{
        marginRight: { sm: "5%", md: "15%" },
        marginLeft: { sm: "5%", md: "15%" },
        marginTop: "10%",
        marginBottom: "2%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: "gray",
            fontWeight: "thin",
          }}
        >
          Welcome to,
        </Typography>
        <Typography
          variant="h2"
          color={textcolor}
          sx={{
            fontWeight: "bold",
          }}
        >
          FlexPlans
        </Typography>
      </Box>

      {isLogged && (
        <div>
          <Typography sx={{ marginTop: "2%", color: "#858585" }}>
            Your current plans,
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              // marginTop: "2%",
              width: { sm: "90vw", md: "70vw" },
              overflowX: "scroll",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                cursor: "",
                paddingY: "10px",
                margin: "8px 0px 8px 0px",
              }}
            >
              {plans.map((obj, index) => {
                // console.log(obj)
                return <PlansCard key={index} info={obj} />;
              })}
            </div>
            {/* <p style={{textWrap:'nowrap'}}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores sequi adipisci aliquam obcaecati deleniti ipsam, modi iusto necessitatibus tempora rerum optio, blanditiis ducimus. Necessitatibus aliquam quasi sint, sequi vero voluptatum.</p> */}
          </Box>
        </div>
      )}

      {/* ultimate map */}
      {
        Object.entries(workouts).map(([type, workoutArray], index)=>(
          <div key={index}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                marginTop: "2%",
                color: textcolor,
                fontWeight: "bold",
              }}
            >
              {type}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                width: { sm: "90vw", md: "70vw" },
                overflowX: "scroll",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  cursor: "",
                  paddingY: "10px",
                  margin: "8px 0px 8px 0px",
                }}
              >
                {console.log(workoutArray)}
                {workoutArray.map((obj, index) => {
                  return <PlansCard key={index} info={obj} />;
                })}
              </div>
            </Box>
          </div>
        ))
      }
      {/* {plansObject.list.map((planObj, index) => {
        return (
          <div key={index}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                marginTop: "2%",
                color: textcolor,
                fontWeight: "bold",
              }}
            >
              {planObj.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                width: { sm: "90vw", md: "70vw" },
                overflowX: "scroll",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  cursor: "",
                  paddingY: "10px",
                  margin: "8px 0px 8px 0px",
                }}
              >
                {planObj.plans.map((obj, index) => {
                  return <PlansCard key={index} info={obj} />;
                })}
              </div>
            </Box>
          </div>
        );
      })} */}

     
    </Box>
  );
}

export default Plans;
