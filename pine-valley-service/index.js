// Express Setup
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9091;

app.use(express.json());

// Setup endpoint
app.post("/pineValley/doctors", async (req, res) => {
    console.log("POST /pineValley/doctors" + req.params.doctorType);
    console.log("Headers:")
    console.log(req.headers);
    console.log("Body:")
    console.log(req.body);

    const doctorType = req.body.doctorType;

    if (doctorType == "Ophthalmologist") {
        res.status(200).json(
            {
                "doctors": {
                    "doctor": [
                        {
                            "name": "John Mathew",
                            "time": "07:30 AM",
                            "hospital": "pineValley"
                        },
                        {
                            "name": "Roma Katherine",
                            "time": "04:30 PM",
                            "hospital": "pineValley"
                        }
                    ]
                }
            }
        )
    } else {
        res.status(500).json(
            {
                message: "Error Occured"
            }
        )
    }
});

app.listen(PORT, () => {
    console.log("Doctor Booking Service running at port " + PORT);
});
