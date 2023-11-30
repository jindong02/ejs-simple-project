const Survey = require('../models/survey'); // Import the Survey model

// Display list of all surveys
exports.listSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.render('surveys/list-survey', { surveys });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display detail page for a specific survey
exports.surveyDetail = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/survey-detail', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display survey create form on GET
exports.surveyCreateGet = (req, res) => {
  res.render('surveys/new-survey');
};

// Handle survey create on POST
exports.surveyCreatePost = async (req, res) => {
  try {
    const survey = new Survey({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,               // Make sure to structure the questions input correctly on the client-side
    });
    await survey.save();
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle survey delete on DELETE.
exports.surveyDeleteGet = async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};


// Display survey update form on GET
exports.surveyUpdateGet = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/edit-survey', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle survey update on POST
exports.surveyUpdatePost = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle survey submission on POST
exports.surveySubmitPost = async (req, res) => {
  try {
    // Find the survey by ID
    const survey = await Survey.findById(req.params.id);

    // Create a new response object based on the submitted answers
    const newResponse = {
      responses: req.body.questions.map((question, index) => {
        return {
          questionText: survey.questions[index].questionText,
          response: req.body[`question_${index}`]
        };
      })
    };

    // Update the survey with the new response
    survey.responses.push(newResponse);
    await survey.save();

    // Redirect or send a success message
    res.redirect('/surveys/' + req.params.id);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
