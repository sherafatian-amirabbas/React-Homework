name: outro
class: middle, center

# Interactive Front-end Development

## Urmas Talimaa
## _Glia Inc_

???

<!-- Dummy notes to check presenter display  -->

Presenter display slide notes

Pre-lecture checklist

* Switching between mirroring and non-mirroring works
* Unrelated tabs and windows closed or minimized
* Do not disturb mode **ON**
* Slides cloned, one has presenters mode on
* Dependencies installed and scripts are working for lecture example code
* Terminal(s) open with code and window to run scripts

---

# Redux

It is about time we made a Redux application!

[Code example](https://github.com/urmastalimaa/interactive-frontend-development/blob/master/lecture_8/src/components/ReduxApp.js)

---

# But developing in the back end is so much nicer!

* 100% agree
* Immutability and pure functions (reducers) are so powerful that it is
  possible to **move** application logic out of the browser and execute it
  server side, which is a very powerful paradigm shift.
* One option for this is React's server side rendering, but Elixir's Phoenix
  LiveView is even more impressive.

---

# But developing in the back end is so much nicer!

https://youtu.be/U_Pe8Ru06fM?t=1143

Notice the
  * pure render function,
  * initial state being calculated upon start-up,
  * handle_event functions (reducers) which return new state based on previous state
    and an action and
  * changes to the DOM are applied using diffs.

???

Having the same pattern being put into good use across many contexts reinforces
its value.

---

# Thanks for hanging on

I hope you

* learned something
* had a bit of fun
* got angry at least once (need to have some emotion to be memorable)

---

# Thanks for hanging on

You now have an idea about techniques for building arbitrary user interfaces

Actual projects are never clean examples, but good guidelines nudge towards a
maintainable application

---
 
# Front end development

* Often regarded as an afterthought - just hack it together
* Front-ends tend to influence back-end design
* Front-end applications need logs and error reports too
* Just because it is JavaScript does not mean that the code should be garbage

---
 
# Front end development

* Keep it **simple**

  Composition! Pure functions!

* Keep it **declarative**

  Easy to read and understand!

* Keep it **testable**

  Less bugs!

---

# Front end development

* Keep it **traceable**

  Logs! Reproducible behaviour!

* Keep **concerns separated**

  Business logic, presentation

---
 
# Exam

* Unfortunately cannot have a in-person multiple choice exam
* Zoom exam with a homework-like exercise
* 21.05 16:15-18:00 - Please try to use this one, let me know if you absolutely
  cannot make it.
* 28.05 16:15-18:00 - Let me know if you absolutely need this timeslot

---
 
# Exam

* Start from existing project scaffold
* Implement a bit of functionality
* Only React usage is graded
* Tests are not mandatory

---
 
# Exam

* Very similar to the lecture "Comment" application

Revise

* React component design - passing props, conditional rendering
* Callbacks
* Links and history-API based routing
* Don't have to use reducers if you don't want to, but need to ensure that you
  are **not directly mutating** state or props


---
 
# Exam

Example ticket:

* Given existing comments: `[{author: "X", text: "a"}, {author: "Y", text: "b"}, {author: "Z", text: "cab"}]`
* Display a list of comments, showing the text and author for each one such
  that the comments can be distinguished from one another and the author can be
  distinguished from the text.

---
 
# Exam

  * Each comment is colored green when it contains the lower-case letter "b",
    blue if it contains the upper-case letter "A" and orange otherwise.
  * Display a button next to each comment "UPPERCASE", that when clicked, will
    convert the comment text to upper-case. The comment colour must immediately
    change when a new colouring rule would apply.
* Show links at the top of the page, one directing to the comment list and the
  other to a welcome page
