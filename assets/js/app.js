// $(function () {

//student data
let students;

//DOM elements
let mainWrapper = $('.main-wrapper');
let titleEl = $('.title');
let closeBtnEl = $('#close-btn');

let studentsInner = $('.students-inner');
let timelineWrapper = $('.timeline-events');
let timelineItemsEl = $('.cd-h-timeline__items-list');
let timelineEventsEl = $('.cd-h-timeline__events-list');

let containerWidth = studentsInner.width();
let containerHeight = $(window).height();
let containerTopOffset = containerHeight * .5; //allow room for showcased student
let containerBottomOffset = containerHeight * .2;


$.getJSON("json/data.json", function (data) {
  students = data.students;
  let studentsHTMLString = '';
  $.each(students, function (i, student) {
    // console.log('student ' + i, student)
    studentsHTMLString += getStudentHTMLString(student, i + 2);
  });
  studentsInner.html(studentsHTMLString);

  //student elements are now in DOM

  let studentEls = $('.student');
  let studentNames = $('.student-name');
  let studentSocials = $('.student-social');



  studentEls.on('click', '.student-avatar', async function () {
    mainWrapper.addClass('is-relative');
    titleEl.addClass('is-left');
    $(this).parent().addClass('is-showcased');
    $(this).parent().css('left', `calc(50% - ${$(this).width()}`);
    // left: calc(50% - 105px) !important;
    closeBtnEl.removeClass('is-hidden');
    $('.student').not('.is-showcased').children('.student-avatar').addClass('is-invisible');

    let timelineItemsHTMLString = '';
    let timelineEventsHTMLString = '';
    let student = getStudent($(this).data('id'));
    // console.log('student', student)
    for (let i = 0; i < student.timeline.length; i++) {
      const item = student.timeline[i];
      console.log('1', i)
      timelineItemsHTMLString += await getTimelineItemHTMLString(item, i);
      console.log('3', i)
      timelineEventsHTMLString += await getEvent(student, item);
      console.log('8', i)
    }


    timelineItemsEl.html(timelineItemsHTMLString);
    timelineEventsEl.html(timelineEventsHTMLString);

    initTimeline();
    //"this" is another object when used inside setTimeout
    let self = this;
    setTimeout(function () {
      $(self).siblings().removeClass('is-invisible');
      timelineWrapper.addClass('is-top');
    }, 600);
  });

  studentEls.css('top', function () {
    return random(containerTopOffset, containerHeight - containerBottomOffset);
  });

  studentEls.css('left', function () {
    return Math.random() * (containerWidth);
  });

  closeBtnEl.on('click', function () {
    mainWrapper.removeClass('is-relative');
    titleEl.removeClass('is-left');
    timelineWrapper.removeClass('is-top');
    studentEls.removeClass('is-showcased');
    studentNames.addClass('is-invisible');
    studentSocials.addClass('is-invisible');
    $(this).addClass('is-hidden');
    $('.student').not('.is-showcased').children('.student-avatar').removeClass('is-invisible');
  });

});

async function getEvent(student, item) {
  console.log('4')
  return new Promise(function (resolve) {
    getTimelineEventHTMLString(student, item)
      .then(function (s) {
        console.log('7')
        resolve(s);
      });
  })

}

function getStudent(id) {
  let student;
  for (let i = 0; i < students.length; i++) {
    student = students[i];
    if (student.id === id.toString()) {
      break;
    }
  }
  return student;
}

async function getTimelineItemHTMLString(item, index) {
  console.log('2')
  let itemHTMLString = `<li><a href="#0" data-date="${item.date}" class="cd-h-timeline__date`;
  if (index === 0) {
    itemHTMLString += ` cd-h-timeline__date--selected"`;
  } else {
    itemHTMLString += `"`;
  }
  itemHTMLString += `></a></li>`;
  return itemHTMLString;
}

async function getTimelineEventHTMLString(student, item) {
  console.log('5')
  return new Promise(async function (resolve, reject) {
    console.log('6')
    let itemHTMLString = `
        <li class="cd-h-timeline__event text-component">
        <div class="cd-h-timeline__event-content container">`;
    if (item.type === 'project') {
      itemHTMLString += `<span class="tag tag-project">${item.type}</span>`;
    }
    if (item.type === 'employment') {
      itemHTMLString += `<span class="tag tag-job">${item.type}</span>`;
    }
    if (item.type === 'internship') {
      itemHTMLString += `<span class="tag tag-internship">${item.type}</span>`;
    }
    itemHTMLString += `<h2>${item.title}</h2>
          <em class="cd-h-timeline__event-date">${item.date}</em>`;

    if (item.slug) {

      let content = await fetch(`templates/student-${student.id}/${item.slug}.html`)
        .then((res) => {
          return res.text();
        });
      console.log('slug', JSON.stringify(content))
      itemHTMLString += content + `</div></li>`
      resolve(itemHTMLString);
    } else if (item.content) {
      itemHTMLString += item.content;
    } else if (item.description) {
      console.log('desc')
      itemHTMLString += `<p>${item.description}</p>`;
    } else {
      itemHTMLString += `<p></p>`;
    }
    itemHTMLString += `</div>
      </li>`;
    console.log('resolve', itemHTMLString)
    resolve(itemHTMLString);
  });
}

function getStudentHTMLString(student, index) {
  let studentHTMLString = `
        <div class="student">
          <div title="${student.displayName}" data-id="${student.id}" class="student-avatar" style="z-index: ${index}">
            <img src="${student.imageUrl}" alt="${student.displayName}" />
          </div>
          <h1 class="student-name is-invisible">${student.displayName}</h1>`;

  //NOTE: bypass cors not working for some social media links so not using below

  //         <p class="student-social is-invisible">`;
  // if (student.socialLinks.twitter) {
  //   studentHTMLString += getSocialHTML('twitter', student.socialLinks.twitter);
  // }
  // if (student.socialLinks.github) {
  //   studentHTMLString += getSocialHTML('github', student.socialLinks.github);
  // }
  // if (student.socialLinks.linkedIn) {
  //   studentHTMLString += getSocialHTML('linkedin', student.socialLinks.linkedin);
  // }
  // if (student.socialLinks.instagram) {
  //   studentHTMLString += getSocialHTML('instagram', student.socialLinks.instagram);
  // }
  // if (student.socialLinks.behance) {
  //   studentHTMLString += getSocialHTML('behance', student.socialLinks.behance);
  // }
  // studentHTMLString += `</p>
  studentHTMLString += `</div>`;
  return studentHTMLString;
}

function getSocialHTML(name, url) {
  return `<span>
    <a onclick="showProject('${url}')" target="_blank">
      <i class="fa fa-${name}"></i>
    </a>
  </span>`
}

function random(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function initTimeline() {
  var horizontalTimeline = document.getElementsByClassName('js-cd-h-timeline'),
    horizontalTimelineTimelineArray = [];
  if (horizontalTimeline.length > 0) {
    for (var i = 0; i < horizontalTimeline.length; i++) {
      horizontalTimelineTimelineArray.push(new HorizontalTimeline(horizontalTimeline[i]));
    }
    // navigate the timeline when inside the viewport using the keyboard
    document.addEventListener('keydown', function (event) {
      if ((event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright')) {
        updateHorizontalTimeline('next'); // move to next event
      } else if ((event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft')) {
        updateHorizontalTimeline('prev'); // move to prev event
      }
    });
  };
}

/*******************
 *     iframe
*******************/

let app = $('.app')
let backBtnEl = $('#back-btn');
let projectIFrame = $('#project-if');

backBtnEl.on('click', function () {
  toggleNav();
})

function toggleNav() {
  if (app.hasClass('is-open')) {
    app.removeClass('is-open');
    backBtnEl.addClass('is-hidden');
    closeBtnEl.removeClass('is-hidden');
    setTimeout(function () {
      closeBtnEl.removeClass('action-btn-abs');
    }, 1000);
  } else {
    closeBtnEl.addClass('action-btn-abs');
    app.addClass('is-open');
    backBtnEl.removeClass('is-hidden');
    closeBtnEl.addClass('is-hidden');

  }
}

function showProject(url) {
  //NOTE: bypass cors - works for Netlify sites (but not some social media links)
  projectIFrame.attr('src', `https://bypasserer.glitch.me/geturl?url=${url}`);
  toggleNav();
}