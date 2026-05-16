console.log("Project Started");

// TASK ARRAY
let tasks = [];

// DOM SELECTION
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const notesInput = document.getElementById("notesInput");

const greeting = document.getElementById("greeting");
const clock = document.getElementById("clock");
const dateElement = document.getElementById("date");

const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const themeBtn = document.getElementById("themeBtn");

const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");
const weatherResult = document.getElementById("weatherResult");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const clearAllBtn = document.getElementById("clearAllBtn");

const toast = document.getElementById("toast");

const progressBar = document.getElementById("progressBar");

const modalOverlay =document.getElementById("modalOverlay");
const modalTitle =document.getElementById("modalTitle");
const modalMessage =document.getElementById("modalMessage");
const cancelModalBtn =document.getElementById("cancelModalBtn");
const confirmModalBtn =document.getElementById("confirmModalBtn");

const editModalOverlay =document.getElementById("editModalOverlay");
const editTaskInput =document.getElementById("editTaskInput");
const cancelEditBtn =document.getElementById("cancelEditBtn");
const saveEditBtn =document.getElementById("saveEditBtn");

const quoteBox =document.getElementById("quoteBox");

// TIMER VARIABLES
let timeLeft = 1500;
let timerInterval;

// DRAG VARIABLE
let draggedTask = null;
let currentEditingTask = null;

// TOAST FUNCTION
function showToast(message, type){

  toast.innerText = message;

  toast.classList.remove(
    "success",
    "error",
    "warning"
  );

  toast.classList.add(type);

  toast.classList.add("show");

  setTimeout(function(){

    toast.classList.remove("show");

  }, 2500);

}

function showModal(title, message, callback){

  modalTitle.innerText = title;

  modalMessage.innerText = message;

  modalOverlay.classList.add("show");

  confirmModalBtn.onclick = function(){

    callback();

    modalOverlay.classList.remove("show");

  };

  cancelModalBtn.onclick = function(){

    modalOverlay.classList.remove("show");

  };

}

// CREATE TASK FUNCTION
function createTask(taskObj){

  const li = document.createElement("li");

  // DRAGGABLE
  li.setAttribute("draggable", true);

  // DRAG START
  li.addEventListener("dragstart", function(){

    draggedTask = li;

    li.style.opacity = "0.5";

  });

  // DRAG END
  li.addEventListener("dragend", function(){

    li.style.opacity = "1";

  });

  // ALLOW DROP
  li.addEventListener("dragover", function(event){

    event.preventDefault();

  });

  // DROP LOGIC
  li.addEventListener("drop", function(){

    if(draggedTask !== li){

      const allTasks = [...taskList.children];

      const draggedIndex =
        allTasks.indexOf(draggedTask);

      const targetIndex =
        allTasks.indexOf(li);

      if(draggedIndex < targetIndex){

        taskList.insertBefore(
          draggedTask,
          li.nextSibling
        );

      }
      else{

        taskList.insertBefore(
          draggedTask,
          li
        );

      }

    }

  });

  // CHECKBOX
  const checkBox =
    document.createElement("div");

  checkBox.classList.add("checkbox");

  // TASK TEXT
  const span =
    document.createElement("span");

  span.innerText = taskObj.text;

   // EDIT TASK
span.addEventListener(
  "dblclick",
  function(){

    showEditModal(taskObj);

  }
);

  // RESTORE COMPLETED
  if(taskObj.completed){

    checkBox.innerText = "✓";

    span.classList.add("completed");

  }

  // TOGGLE COMPLETED
  checkBox.addEventListener("click", function(){

    taskObj.completed =
      !taskObj.completed;

    // SAVE
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

    // RE-RENDER
    renderTasks(tasks);

  });

  li.appendChild(checkBox);

  li.appendChild(span);

  // DELETE BUTTON
  const deleteBtn =
    document.createElement("button");

  deleteBtn.innerText = "Delete";

  deleteBtn.addEventListener(
    "click",
    function(event){

      event.stopPropagation();

      showToast(
        "🗑️ Task Deleted",
        "error"
      );

      // REMOVE TASK
      tasks = tasks.filter(function(task){

        return task !== taskObj;

      });

      // SAVE
      localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
      );

      // RE-RENDER
      renderTasks(tasks);

    }
  );

  li.appendChild(deleteBtn);

  // ADD TO UI
  taskList.appendChild(li);

}

// UPDATE TASK STATS
function updateTaskStats(){

  const total = tasks.length;

  const completed =
    tasks.filter(function(task){

      return task.completed;

    }).length;

  const pending =
    total - completed;

  // UPDATE TEXT
  totalTasks.innerText =
    `Total Tasks: ${total}`;

  completedTasks.innerText =
    `Completed: ${completed}`;

  pendingTasks.innerText =
    `Pending: ${pending}`;

  // CALCULATE %
  let progress = 0;

  if(total > 0){

    progress = Math.round(
      (completed / total) * 100
    );

  }

  // UPDATE BAR
  progressBar.style.width =
    `${progress}%`;

  progressBar.innerText =
    `${progress}%`;

}

// RENDER TASKS
function renderTasks(filteredTasks){

  taskList.innerHTML = "";

  filteredTasks.forEach(function(task){

    createTask(task);

  });

  updateTaskStats();

}

// ADD TASK
addTaskBtn.addEventListener("click", function(){

  const taskText =
    taskInput.value.trim();

  if(taskText === ""){

    showToast(
      "⚠️ Please enter a task",
      "warning"
    );

    return;

  }

  const taskObj = {

    text: taskText,
    completed: false

  };

  // ADD TO ARRAY
  tasks.push(taskObj);

  // SAVE
  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

  // RENDER
  renderTasks(tasks);

  // TOAST
  showToast(
    "✅ Task Added",
    "success"
  );

  // CLEAR INPUT
  taskInput.value = "";

});

// ENTER KEY SUPPORT
taskInput.addEventListener(
  "keydown",
  function(event){

    if(event.key === "Enter"){

      event.preventDefault();

      addTaskBtn.click();

    }

  }
);

// LOAD SAVED TASKS
const storedTasks =
  JSON.parse(
    localStorage.getItem("tasks")
  );

if(storedTasks){

  tasks = storedTasks;

  renderTasks(tasks);

}

// SAVE NOTES
const savedNotes =
  localStorage.getItem("notes");

if(savedNotes){

  notesInput.value = savedNotes;

}

// AUTO SAVE NOTES
notesInput.addEventListener(
  "input",
  function(){

    localStorage.setItem(
      "notes",
      notesInput.value
    );

  }
);

// CLOCK + GREETING
function updateClock(){

  const now = new Date();

  const hours = now.getHours();

  const minutes = now
    .getMinutes()
    .toString()
    .padStart(2, "0");

  let greetingText = "";

  if(hours < 12){

    greetingText =
      "Good Morning ☀️";

  }
  else if(hours < 18){

    greetingText =
      "Good Afternoon 🌤️";

  }
  else{

    greetingText =
      "Good Evening 🌙";

  }

  let formattedHours =
    hours % 12 || 12;

  const ampm =
    hours >= 12 ? "PM" : "AM";

  const today =
    now.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric"
      }
    );

  clock.innerText =
    `${formattedHours}:${minutes} ${ampm}`;

  greeting.innerText =
    greetingText;

  dateElement.innerText =
    today;

}

updateClock();

setInterval(updateClock, 1000);

// TIMER DISPLAY
function updateTimerDisplay(){

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  timer.innerText =
    `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

}

// START TIMER
startBtn.addEventListener("click", function(){

  clearInterval(timerInterval);

  timerInterval = setInterval(function(){

    if(timeLeft > 0){

      timeLeft--;

      updateTimerDisplay();

    }

  }, 1000);

});

// PAUSE TIMER
pauseBtn.addEventListener("click", function(){

  clearInterval(timerInterval);

});

// RESET TIMER
resetBtn.addEventListener("click", function(){

  clearInterval(timerInterval);

  timeLeft = 1500;

  updateTimerDisplay();

});

updateTimerDisplay();

// THEME TOGGLE
themeBtn.addEventListener("click", function(){

  document.body.classList.toggle(
    "light-mode"
  );

  if(
    document.body.classList.contains(
      "light-mode"
    )
  ){

    themeBtn.innerText =
      "☀️ Light Mode";

    localStorage.setItem(
      "theme",
      "light"
    );

  }
  else{

    themeBtn.innerText =
      "🌙 Dark Mode";

    localStorage.setItem(
      "theme",
      "dark"
    );

  }

});

// RESTORE THEME
const savedTheme =
  localStorage.getItem("theme");

if(savedTheme === "light"){

  document.body.classList.add(
    "light-mode"
  );

  themeBtn.innerText =
    "☀️ Light Mode";

}
else{

  themeBtn.innerText =
    "🌙 Dark Mode";

}

// WEATHER FUNCTION
async function getWeather(){

  const city =
    cityInput.value.trim();

  if(city === ""){

    showToast(
      "🌍 Please enter a city",
      "warning"
    );

    return;

  }

  const apiKey = "YOUR_API_KEY";

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try{

    const response =
      await fetch(url);

    const data =
      await response.json();

    // INVALID CITY
    if(data.cod == 404){

      weatherResult.innerHTML =
        `<p>City not found</p>`;

      return;

    }

    // WEATHER EMOJI
    let weatherEmoji = "";

    const weatherMain =
      data.weather[0].main;

    if(weatherMain === "Clear"){

      weatherEmoji = "☀️";

    }
    else if(
      weatherMain === "Clouds"
    ){

      weatherEmoji = "☁️";

    }
    else if(
      weatherMain === "Rain"
    ){

      weatherEmoji = "🌧️";

    }
    else if(
      weatherMain === "Thunderstorm"
    ){

      weatherEmoji = "⛈️";

    }
    else if(
      weatherMain === "Snow"
    ){

      weatherEmoji = "❄️";

    }
    else if(
      weatherMain === "Mist"
    ){

      weatherEmoji = "🌫️";

    }
    else{

      weatherEmoji = "🌍";

    }

    // DISPLAY WEATHER
    weatherResult.innerHTML = `
      <h3>${data.name}</h3>

      <p>
        Temperature:
        ${data.main.temp}°C
      </p>

      <p>
        Weather:
        ${weatherEmoji}
        ${data.weather[0].main}
      </p>

      <p>
        Humidity:
        ${data.main.humidity}%
      </p>
    `;

  }
  catch(error){

    weatherResult.innerHTML =
      `<p>Please enter a valid city</p>`;

  }

}

// WEATHER BUTTON
weatherBtn.addEventListener(
  "click",
  getWeather
);

// ENTER KEY WEATHER
cityInput.addEventListener(
  "keydown",
  function(event){

    if(event.key === "Enter"){

      getWeather();

    }

  }
);

// MOTIVATIONAL QUOTES ARRAY
const quotes = [

  "Success doesn’t come from motivation. It comes from consistency.",

  "Small progress every day adds up to big results.",

  "Discipline is choosing between what you want now and what you want most.",

  "Your future is created by what you do today.",

  "Dream big. Start small. Act now.",

  "Focus on becoming better, not perfect.",

  "You don’t have to be extreme, just consistent.",

  "Push yourself because nobody else will do it for you.",

  "Hard work beats talent when talent doesn’t work hard.",

  "The pain of discipline is better than the pain of regret.",

  "Stay focused and never give up.",

  "Every expert was once a beginner.",

  "Consistency creates confidence.",

  "Done is better than perfect.",

  "Make yourself proud."

];

// RANDOM QUOTE FUNCTION
function getQuote(){

  const randomIndex = Math.floor(
    Math.random() * quotes.length
  );

  quoteBox.innerHTML = `
    "${quotes[randomIndex]}"
  `;

}
// FILTERS
allBtn.addEventListener("click", function(){

  renderTasks(tasks);

});

completedBtn.addEventListener(
  "click",
  function(){

    const completed =
      tasks.filter(function(task){

        return task.completed;

      });

    renderTasks(completed);

  }
);

pendingBtn.addEventListener(
  "click",
  function(){

    const pending =
      tasks.filter(function(task){

        return !task.completed;

      });

    renderTasks(pending);

  }
);

// CLEAR ALL
clearAllBtn.addEventListener(
  "click",
  function(){

    showModal(
      "Delete All Tasks",

      "Are you sure you want to delete all tasks?",

      function(){

        tasks = [];

        localStorage.setItem(
          "tasks",
          JSON.stringify(tasks)
        );

        renderTasks(tasks);

        showToast(
          "🗑️ All Tasks Cleared",
          "error"
        );

      }

    );

  }
);

// SHOW EDIT MODAL
function showEditModal(taskObj){

  currentEditingTask = taskObj;

  editTaskInput.value =
    taskObj.text;

  editModalOverlay.classList.add(
    "show"
  );

}

// SAVE EDIT
saveEditBtn.addEventListener(
  "click",
  function(){

    const updatedText =
      editTaskInput.value.trim();

    if(updatedText === ""){

      showToast(
        "⚠️ Task cannot be empty",
        "warning"
      );

      return;

    }

    currentEditingTask.text =
      updatedText;

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

    renderTasks(tasks);

    editModalOverlay.classList.remove(
      "show"
    );

    showToast(
      "✏️ Task Updated",
      "success"
    );

  }
);

// CANCEL EDIT
cancelEditBtn.addEventListener(
  "click",
  function(){

    editModalOverlay.classList.remove(
      "show"
    );

  }
);

getQuote();