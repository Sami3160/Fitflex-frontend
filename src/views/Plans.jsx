// this component is temperary and will be replaced with the actual workout and exercise components

import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from 'axios'
import PlansCardV2 from "../components/PlanCardsV2";
import { useAuth } from "../context/AuthContext";
const URL = import.meta.env.VITE_API_URL;

function Plans({ mode, textcolor }) {

  // const workouts=useWorkout()
  const [workouts, setWorkouts] = useState({});
  const [workoutsInProgress, setWorkoutsInProgress] = useState([]);
  const { user } = useAuth()
  useEffect(() => {
    document.title = "FitFlex-Know Your Plans";
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${URL}/api/workouts`)
        setWorkouts(response.data.data)
        console.log(response.data.data)

      } catch (error) {
        console.error(error)
      }
    }
    fetchWorkouts()

  }, []);
 

  const [isLogged, setLogged] = useState(false);


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

      {user && user?.inprogressWorkouts?.length > 0 && (
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
              {/* {workouts?.map((obj, index) => {
                return <PlansCardV2 key={index} info={obj} />;
              })} */}
            </div>
            {/* <p style={{textWrap:'nowrap'}}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores sequi adipisci aliquam obcaecati deleniti ipsam, modi iusto necessitatibus tempora rerum optio, blanditiis ducimus. Necessitatibus aliquam quasi sint, sequi vero voluptatum.</p> */}
          </Box>
        </div>
      )}

      {/* ultimate map */}
      {
        Object.entries(workouts).map(([type, workoutArray], index) => (
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
                padding: "10px",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  cursor: "",
                  gap: "10px",
                  paddingY: "10px",
                  margin: "8px 0px 8px 0px",
                }}
              >
                {workoutArray?.map((obj, index) => {
                  let progressData = {};
                  if (user?.inprogressWorkouts) {
                    for (let progressObj of user.inprogressWorkouts) {
                      if (progressObj.workoutId === obj.workoutId) {
                        progressData = progressObj;
                        break;
                      }
                    }
                  }
                  if (user?.completedWorkouts) {
                    for (let progressObj of user.completedWorkouts) {
                      if (progressObj.workoutId === obj.workoutId) {
                        progressData = progressObj;
                        break;
                      }
                    }
                  }
                  return <PlansCardV2 key={index} info={obj} progressData={progressData} />;
                })}
              </div>
            </Box>
          </div>
        ))
      }



    </Box>
  );
}

export default Plans;
