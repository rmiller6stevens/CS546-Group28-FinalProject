//import express, express router as shown in lecture code

import { Router } from "express";
import * as helpers from "../helpers.js";
import user from "../data/users.js";
import { reviewData, userData } from "../data/index.js";
import { coursesData } from "../data/index.js";
import { protectedMiddleware } from "../middleware.js";
import xss from "xss";
import path from "path";
const __dirname = path.resolve();
const router = Router();

import multer from "multer";
import reviews from "../data/reviews.js";

//middlware and initialization for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.emailAddressInput + ".jpeg");
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});
const upload = multer({ storage: storage });

//routes starts

router.route("/").get(async (req, res) => {
  try {
    return res.render("homepage");
    // return res.json({ error: "in / route" });
  } catch (e) {
    return res.json({ error: "error" });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    try {
      return res.render("register");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
  })
  .post(upload.single("uploadPicture"), async (req, res, next) => {
    //code here for POST
    try {
      const regData = req.body; // getting data from form

      //storing individual fields data from the form

      let firstName = xss(regData.firstNameInput);
      let lastName = xss(regData.lastNameInput);
      let email = xss(regData.emailAddressInput);
      let gradYear = xss(regData.graduationYear);
      let password = xss(regData.passwordInput);

      let confirmPassword = xss(regData.confirmPasswordInput);
      let userName = xss(regData.userNameInput);

      let picture = xss(regData.uploadPicture);

      //error handling for other fields
      //error handling server side including handlebars

      if (!userName) {
        return res
          .status(400)
          .render("register", {
            errorUserName: "Enter username Name",
            regData: regData,
          });
      }
      if (!firstName) {
        return res
          .status(400)
          .render("register", {
            errorFirstName: "Enter First Name",
            regData: regData,
          });
      }
      if (typeof firstName !== "string") {
        return res
          .status(400)
          .render("register", {
            errorFirstName: "Enter Only Strings",
            regData: regData,
          });
      }

      if (helpers.checkSymbols(firstName)) {
        return res
          .status(400)
          .render("register", {
            errorFirstName: "No symbols in first name",
            regData: regData,
          });
      }
      if (helpers.checkSymbols(lastName)) {
        return res
          .status(400)
          .render("register", {
            errorLastName: "No symbols in last name",
            regData: regData,
          });
      }

      if (helpers.checkNumbers(firstName)) {
        return res
          .status(400)
          .render("register", {
            errorFirstName: "no numbers in name",
            regData: regData,
          });
      }
      if (helpers.checkNumbers(lastName)) {
        return res
          .status(400)
          .render("register", {
            errorLastName: "no numbers in name",
            regData: regData,
          });
      }

      if (firstName.length < 2 || firstName.length > 25) {
        return res
          .status(400)
          .render("register", {
            errorFirstName: "First name length betwween 2 and 25",
            regData: regData,
          });
      }
      if (lastName.length < 2 || lastName.length > 25) {
        return res
          .status(400)
          .render("register", {
            errorLastName: "Last Name length between 2 and 25",
            regData: regData,
          });
      }

      if (typeof lastName !== "string") {
        return res
          .status(400)
          .render("register", {
            errorLastName: "Enter Only Strings",
            regData: regData,
          });
      }

      if (!lastName) {
        return res
          .status(400)
          .render("register", {
            errorLastName: "Enter Last Name",
            regData: regData,
          });
      }

      if (!password) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "Enter Password",
            regData: regData,
          });
      }

      if (!confirmPassword) {
        return res
          .status(400)
          .render("register", {
            errorConfirmPassword: "Enter Confirm Password",
            regData: regData,
          });
      }

      if (!userName) {
        return res
          .status(400)
          .render("register", {
            errorUserName: "Enter Username",
            regData: regData,
          });
      }

      if (!email) {
        return res
          .status(400)
          .render("register", { errorEmail: "Enter Email", regData: regData });
      }

      if (!helpers.validateEmail(email)) {
        return res
          .status(400)
          .render("register", {
            errorEmail: "wrong email format",
            regData: regData,
          });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "password length less than 8",
            regData: regData,
          });
      }

      if (!helpers.validatePassword(password)) {
        return res.status(400).render("register", {
          errorPassword: "enter at least one special character",
          regData: regData,
        });
      }

      if (!gradYear) {
        return res
          .status(400)
          .render("register", {
            gradYearerror: "Enter Graduation Year",
            regData: regData,
          });
      }
      gradYear = gradYear.trim();

      gradYear = parseInt(gradYear);
      if (
        gradYear < new Date().getFullYear() ||
        gradYear > new Date().getFullYear() + 5
      ) {
        return res.status(400).render("register", {
          gradYearerror: "Range within 5 years from now",
          regData: regData,
        });
      }

      gradYear = gradYear.toString();

      if (!helpers.checkNumbers(password)) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "Enter atleast one number",
            regData: regData,
          });
      }
      if (!helpers.checkLowerCase(password)) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "Enter atleast one lower case",
            regData: regData,
          });
      }
      if (!helpers.checkUpperCase(password)) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "Enter atleast one uppercase",
            regData: regData,
          });
      }

      if (helpers.checkBlankChars(password)) {
        return res
          .status(400)
          .render("register", {
            errorPassword: "blank in password",
            regData: regData,
          });
      }

      if (password !== confirmPassword) {
        return res.status(400).render("register", {
          errorConfirmPassword: "password did not match",
          regData: regData,
        });
      }

      //error handling for courses in array
      let courseField = req.body.courseFieldsInput; // taking in no of courses from 1-4
      let courses = []; //storing the courses in this array

      courseField = parseInt(courseField); //converting from string to number

      if (!courseField || courseField == 0) {
        //checking whether user has selected any courses
        return res.render("register", {
          courseError: "You have to select atleast one course",
          regData: regData,
        });
      }
      //further error handling  and adding courses to the array
      let field = "";
      for (let courseNo = 1; courseNo <= courseField; courseNo++) {
        field = "field" + `${courseNo}`;
        let reqfield = req.body[field];
        reqfield = reqfield.toLowerCase();
        reqfield = reqfield.trim();

        if (!reqfield || typeof reqfield === "undefined") {
          return res.render("register", {
            courseError: "enter a CS course (CSXXX) XXX-> course codes",
            coursefield: reqfield,
            regData: regData,
          });
        }
        if (reqfield.length !== 5) {
          return res.render("register", {
            courseError: "incorrect code",
            coursefield: reqfield,
            regData: regData,
          });
        }

        if (reqfield.slice(0, 2) !== "cs") {
          return res.render("register", {
            courseError: "ONLY CS COURSES",
            coursefield: reqfield,
            regData: regData,
          });
        }

        let reqfieldCode = parseInt(reqfield.slice(2, 5));
        if (typeof reqfieldCode !== "number") {
          return res.render("register", {
            courseError: "Only numbers as codes",
            coursefield: reqfield,
            regData: regData,
          });
        }

        if (reqfieldCode < 101 || reqfieldCode > 900) {
          return res.render("register", {
            courseError: "Code range between 101 and 900",
            coursefield: reqfield,
            regData: regData,
          });
        }
        reqfield = reqfield.toLowerCase();

        courses.push(reqfield); //final array addition
      }
      //final error handling
      if (new Set(courses).size !== courses.length) {
        return res.render("register", {
          courseError: "No same courses",
          regData: regData,
        });
      }

      userName = userName.trim();
      firstName = firstName.trim();
      lastName = lastName.trim();
      email = email.trim();

      gradYear = gradYear.toString();
      gradYear = gradYear.trim();

      //inserting the requested body in db
      const createUser = await user.create(
        userName,
        firstName,
        lastName,
        email,
        password,
        courses,
        gradYear
      );

      if (createUser) {
        console.log(createUser);
        return res.render("login", { message: "user successfully created" });
      } else {
        res.render("register", {
          error: "User already exists or try again",
          regData: regData,
        });
      }

      next();
    } catch (e) {
      const regData = req.body;
      res.render("register", { error: e, regData: regData });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    try 
    {

    res.render("login", {});
    }
    catch(e)
    {
      return res.render("error", {error:e})
    }
  })
  .post(async (req, res) => {
    //code here for POST
    // const { email, password } = req.body;
    let email = req.body.emailAddressInput;
    let password = req.body.passwordInput;

    email = xss(email);
    password = xss(password);

    if (!email || !password) {
      return res.status(400).render("login", {
        errorMessage: "Please provide a valid email address and password.",
      });
    }

    email = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).render("login", {
        errorMessage: "Please provide a valid email address.",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).render("login", {
        errorMessage:
          "Please provide a valid password (at least 8 characters long, with one uppercase letter, one number and one special character).",
      });
    }

    try {
      const checkedUser = await user.checkUser(email, password);
      if (checkedUser) {
        console.log(checkedUser);

        req.session.user = checkedUser;

        return res.redirect("protected");
      } else {
        console.log("here");
        return res.render("login", { errorMessage: "try again " });
      }
    } catch (e) {
      return res
        .status(400)
        .render("error", { title: "Login", hasError: true });
    }
  });



router
  .get("/protected", async (req, res) => {
    //code here for GET

    try {
      // if (req.session.user.role === "user" || req.session.user.role === "admin") {

      const date = new Date();
      console.log(req.session.user + "in protected route");
      res.render("protected", {
        userData: req.session.user,
        currentTime: date,
      });

      //}
    } catch (e) {
      return res.render("error", { error: e });
    }
  })

  .post(async (req, res) => {
    try {
      console.log("hre in protected post");
      console.log(req.session.user);
    
    } catch (e) {
      console.log(e);
    }
  });

router
  .route("/reviews")

  //getting all reviews for a course
  .get(async (req, res) => {
    try {
      const userData = req.session.user;

      if (!userData) {
        return res.redirect("/login");
      }

      res.render("protected", { userData: userData });
    } catch (e) {
      return res.render("protected", { error: e });
    }
  })

  //creating a new review
  .post(async (req, res) => {
    try {
      const regData = req.body;
      const reqData = req.session.user;

      if (!regData) {
        return res.redirect("/login");
      }

      let courseId = xss(regData.courseIdInput);
      courseId = courseId.toLowerCase();
      const userId = xss(reqData.userId.toString());
      const reviewText = xss(regData.reviewTextInput);
      const rating = xss(regData.ratingInput);

      //error handling
      if (!courseId || !/^[a-zA-Z]{2,4}\d{3}$/i.test(courseId)) {
        return res
          .status(400)
          .render("protected", {
            errorReview: "Course id format wrong",
            reqData: reqData,
            userData: regData,
          });
      }

      if (!courseId || !userId || !reviewText || !rating) {
        return res
          .status(400)
          .render("protected", {
            errorReview: "Enter the fields",
            reqData: reqData,
            userData: regData,
          });
      }

      if (typeof reviewText !== "string") {
        return res
          .status(400)
          .render("protected", {
            errorReview: "Wrong Data type",
            reqData: reqData,
            userData: regData,
          });
      }

      if (reviewText.length < 5 || reviewText.length > 100) {
        return res
          .status(400)
          .render("protected", {
            errorReview: "length error",
            reqData: reqData,
            userData: regData,
          });
      }

      // check rating is between 1 and 5
      if (parseInt(rating) < 1 || parseInt(rating) > 5) {
        return res
          .status(400)
          .render("protected", {
            errorReview: "Rating range wrong",
            reqData: reqData,
            userData: regData,
          });
      }

      const createReview = await reviewData.create(
        courseId,
        userId,
        reviewText,
        rating
      );

      if (createReview) {
        return res.render("protected", {
          message: "Successfully created review!",
          userData: regData,
        });
      } else {
        return res
          .status(400)
          .render("protected", {
            errorReview: "review only once",
            userData: regData,
            reqData: reqData,
          });
      }
    } catch (e) {
      const userData = req.session.user;
      return res.render("protected", { errorReview: e, userData: userData });
    }
  });

router.route("/error").get(async (req, res) => {
  try {
    res.render.status(400)("error", { error: e });
  } catch (e) {
    res.render("error", { error: e });
  }
});

router
  .route("/test")
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        return res.redirect("/protected");
      } else {
        return res.redirect("/login");
      }
    } catch (e) {
      return res.render("error", { error: e });
    }
  })

  .post(async (req, res) => {
    try {
      let reqfield = req.body.searchTerm;

      reqfield = reqfield.toLowerCase();
      reqfield = reqfield.trim();

      if (!reqfield || typeof reqfield === "undefined") {
        return res.render("reviews", {
          courseError: "enter a CS course (CSXXX) XXX-> course codes",
          coursefield: reqfield,
        });
      }
      if (reqfield.length !== 5) {
        return res.render("reviews", {
          courseError: "incorrect code",
          coursefield: reqfield,
        });
      }

      if (reqfield.slice(0, 2) !== "cs") {
        return res.render("reviews", {
          courseError: "ONLY CS COURSES",
          coursefield: reqfield,
        });
      }

      let reqfieldCode = parseInt(reqfield.slice(2, 5));
      console.log(typeof reqfieldCode);
      if (typeof reqfieldCode !== "number") {
        return res.render("reviews", {
          courseError: "Only numbers as codes",
          coursefield: reqfield,
        });
      }

      if (reqfieldCode < 101 || reqfieldCode > 900) {
        return res.render("reviews", {
          courseError: "Code range between 101 and 900",
          coursefield: reqfield,
        });
      }
      console.log(typeof reqfield);

      const getCourse = await coursesData.get(reqfield);

      console.log(getCourse);

      res.render("reviews", {
        course: getCourse.reviews,
        courseCode: getCourse.courseCode,
        courseObj: getCourse,
      });
    } catch (e) {
      return res.render("error", { error: e });
    }
  });

router.route("/homepage").get(async (req, res) => {
  try {
    return res.render("homepage");
  } catch (e) {
    return res.render("error", { error: e });
  }
});

router.route("/logout").get(async (req, res) => {
  //code here for GET

  try {
    req.session.destroy();
    res.render("logout");
  } catch (e) {
    return res.status(400).render("error", { error: e });
  }
});
//for chatroom
router
  .route("/indexx/:cr")
  .get(async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }
    } catch (e) {
      return res.render("error", { error: e });
    }

    try {
      let paramcourse = req.params.cr;
      // let newCourses = []
      let newcourse;
      const user = req.session.user;

      paramcourse = paramcourse.toLowerCase();

      if (user) {
        for (let x of user.courses) {
          let addedCourse = await coursesData.get(x);
          if (paramcourse === addedCourse.courseCode.toLowerCase()) {
            newcourse = addedCourse;
            console.log(newcourse);
            return res.render("index", { user: user, newcourse: newcourse });
          }
          // newCourses.push(await courseData.get(x))
        }
      } else {
        return res.render("error", { error: "login again" });
      }
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  })

  .post(async (req, res) => {});

export default router;
