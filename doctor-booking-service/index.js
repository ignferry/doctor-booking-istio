// Express Setup
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const GO_URL = process.env.GO_URL || "http://localhost:9091"
const PV_URL = process.env.PV_URL || "http://localhost:9091"

app.use(express.json());

// Setup endpoint
app.get("/healthcare/doctor/:doctorType", async (req, res) => {
    console.log("GET /healthcare/doctor/" + req.params.doctorType);

    const doctorType = req.params.doctorType;

    try {
        // Requests to hospital services
        const promises = [
            fetch(GO_URL + "/grandOak/doctors/" + doctorType),
            fetch(PV_URL + "/pineValley/doctors",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        doctorType: doctorType
                    }
                )
            }
            )
        ];
        const responses = await Promise.allSettled(promises);
        const jsonPromises = []

        responses.forEach((result) => {
            if (result.status == "fulfilled") {
                jsonPromises.push(result.value.json());
            }
        });

        // Process json
        const doctors = [];
        const jsonResponses = await Promise.allSettled(jsonPromises);

        jsonResponses.forEach((result) => {
            doctors.push(result["value"]["doctors"]["doctor"]);
        })

        console.log(doctors);
        res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        res.status(500).json(
            {
                message: "Error Occured"
            }
        )
        return
    }
});

app.listen(PORT, () => {
    console.log("Doctor Booking Service running at port " + PORT);
});
