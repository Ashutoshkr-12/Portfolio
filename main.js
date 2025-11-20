document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initNavbar();
  initScrollAnimations();
  initSkillBars();
  initContactForm();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add scrolled class to navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

}

function initScrollAnimations() {
  // Intersection Observer for scroll reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'active');
      }
    });
  }, observerOptions);

  // Observe all elements that should animate on scroll
  const elementsToObserve = [
    '.skill-card',
    '.project-card',
    '.timeline-item',
    '.about-content',
    '.contact-content'
  ];

  elementsToObserve.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      observer.observe(element);
    });
  });
}

function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  // Intersection Observer for skill bars
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const progress = progressBar.getAttribute('data-progress');

        // Animate the skill bar
        setTimeout(() => {
          progressBar.style.width = `${progress}%`;
        }, 200);

        // Stop observing once animated
        observer.unobserve(progressBar);
      }
    });
  }, observerOptions);

  // Observe all skill bars
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}


function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const successMessage = document.getElementById('form-success');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual field
  function validateField(input, errorId, validationFn) {
    const errorElement = document.getElementById(errorId);
    const value = input.value.trim();

    if (!value) {
      errorElement.textContent = 'This field is required';
      return false;
    }

    if (validationFn && !validationFn(value)) {
      errorElement.textContent = validationFn.errorMessage || 'Invalid input';
      return false;
    }

    errorElement.textContent = '';
    return true;
  }

  // Email validation function
  function validateEmail(email) {
    const isValid = emailRegex.test(email);
    validateEmail.errorMessage = 'Please enter a valid email address';
    return isValid;
  }

  // Name validation function
  function validateName(name) {
    const isValid = name.length >= 2;
    validateName.errorMessage = 'Name must be at least 2 characters';
    return isValid;
  }

  // Subject validation function
  function validateSubject(subject) {
    const isValid = subject.length >= 3;
    validateSubject.errorMessage = 'Subject must be at least 3 characters';
    return isValid;
  }

  // Message validation function
  function validateMessage(message) {
    const isValid = message.length >= 10;
    validateMessage.errorMessage = 'Message must be at least 10 characters';
    return isValid;
  }

  // Real-time validation on blur
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, 'name-error', validateName);
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, 'email-error', validateEmail);
  });

  subjectInput.addEventListener('blur', () => {
    validateField(subjectInput, 'subject-error', validateSubject);
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, 'message-error', validateMessage);
  });

  // Clear error on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      const errorId = `${input.id}-error`;
      document.getElementById(errorId).textContent = '';
    });
  });

  // Form submission
  form.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameInput, 'name-error', validateName);
    const isEmailValid = validateField(emailInput, 'email-error', validateEmail);
    const isSubjectValid = validateField(subjectInput, 'subject-error', validateSubject);
    const isMessageValid = validateField(messageInput, 'message-error', validateMessage);

    // Check if all fields are valid
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      // Get form data
      const formData = new FormData();
      formData.append("access_key", "a61f0403-58ee-45ac-a13f-23e70bcfa49f");
      formData.append("name",nameInput.value.trim()) 
      formData.append("email",emailInput.value.trim()) 
      formData.append("subject",subjectInput.value.trim()) 
      formData.append("message",messageInput.value.trim()) 
      
        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if(data.success){
          successMessage.classList.add('show')
          form.reset();

          setTimeout(()=> {
            successMessage.classList.remove('show')
          },5000);

            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }else{
          alert("something went wrong. Please try again")
        }
        } catch (error) {
          console.error("Error in submitting form:",error);
           alert("There was an error connecting to the server.");
        }

      // Log form data (in a real application, you would send this to a server)
      console.log('Form submitted with data:', formData);

      // Show success message
      successMessage.classList.add('show');

      // Reset form
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);

      // Smooth scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-error:not(:empty)');
      if (firstError) {
        firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

