$(function () {
  
  
    //student data
    let students;

    //DOM elements
    let titleEl = $('.title');
    let closeBtnEl = $('.close');

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
        titleEl.addClass('is-left');
        $(this).parent().addClass('is-showcased');
        $(this).parent().css('left', `calc(50% - ${$(this).width()}`);
        // left: calc(50% - 105px) !important;
        closeBtnEl.removeClass('is-invisible');
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
        titleEl.removeClass('is-left');
        timelineWrapper.removeClass('is-top');
        studentEls.removeClass('is-showcased');
        studentNames.addClass('is-invisible');
        studentSocials.addClass('is-invisible');
        $(this).addClass('is-invisible');
        $('.student').not('.is-showcased').children('.student-avatar').removeClass('is-invisible');
      });

    });

    async function getEvent(student, item){
      console.log('4')
      return new Promise(function(resolve){
        getTimelineEventHTMLString(student, item)
      .then(function(s){
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
      itemHTMLString += `>${item.date}</a></li>`;
      return itemHTMLString;
    }

    async function getTimelineEventHTMLString(student, item) {
      console.log('5')
      return new Promise(async function(resolve, reject){  
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
        console.log('content')
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
      return `
        <div class="student">
          <div data-id="${student.id}" class="student-avatar" style="z-index: ${index}">
            <img src="${student.imageUrl}" alt="${student.displayName}" />
          </div>
          <h1 class="student-name is-invisible">${student.displayName}</h1>
          <p class="student-social is-invisible">
            <span>
              <a href="https://twitter.com/MDesignsuk" target="_blank">
                <i class="fa fa-twitter"></i>
              </a>
            </span>
            <span>
              <a href="https://github.com/Mario-Duarte/" target="_blank">
                <i class="fa fa-github"></i>
              </a>
            </span>
            <span>
              <a href="https://bitbucket.org/Mario_Duarte/" target="_blank">
                <i class="fa fa-bitbucket"></i>
              </a>
            </span>
            <span>
              <a href="https://codepen.io/MarioDesigns/" target="_blank">
                <i class="fa fa-codepen"></i>
              </a>
            </span>
          </p>
        </div>
      `;
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
  });