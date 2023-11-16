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
    const response = [];

    try {
        // Get data from grandOak
        console.log("Retrieving data from GrandOak")
        const grandOakResponse = await fetch(GO_URL + "/grandOak/doctors/" + doctorType);
        const grandOakResponseJson = await grandOakResponse.json();
        response.push(grandOakResponseJson["doctors"]["doctor"])

        // Get data from pineValley
        console.log("Retrieving data from PineValley")
        const pineValleyResponse = await fetch(PV_URL + "/pineValley/doctors",
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
        );
        const pineValleyResponseJson = await pineValleyResponse.json();
        response.push(pineValleyResponseJson["doctors"]["doctor"])
    } catch (e) {
        console.log(e);
        res.status(500).json(
            {
                message: "Error Occured"
            }
        )
        return
    }


    return res.json(response)
});

app.listen(PORT, () => {
    console.log("Doctor Booking Service running at port " + PORT);
});
