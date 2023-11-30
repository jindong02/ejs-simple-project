const express = require("express");
const router = express.Router();
const surveyController = require("./surveycontroller");

// Route to display all surveys
router.get("/", surveyController.listSurveys);

// Route to display the form for creating a new survey
router.get("/new", surveyController.surveyCreateGet);

// Route to handle the form submission for creating a new survey
router.post("/", surveyController.surveyCreatePost);

// Route to display a single survey's detail
router.get("/:id", surveyController.surveyDetail);

// Route to display the form to edit an existing survey
router.get("/:id/edit", surveyController.surveyUpdateGet);

// Route to handle the form submission for updating an existing survey
router.put("/:id", surveyController.surveyUpdatePost);

// Route to handle the deletion of a survey
router.delete("/:id", surveyController.surveyDeleteGet);

// Route to handle the survey submission
router.post("/:id/submit", surveyController.surveySubmitPost);

module.exports = router;
