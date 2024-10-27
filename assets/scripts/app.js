// start register service_worker

// window.addEventListener("DOMContentLoaded", async () => {
//   if ("serviceWorker" in navigator) {
//     const register = await navigator.serviceWorker.register("sw.js");
//     return register;
//   } else {
//     console.log("your browser not supported serviceWorker");
//   }
// });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../../sw.js').then(function(registration) {
  console.log('ServiceWorker registration successful with scope: ', registration.scope);
}).catch(function(err) {
  //registration failed :(
  console.log('ServiceWorker registration failed: ', err);
});
}else {
console.log('No service-worker on this browser');
}

// end register service_worker


//start fetch data


const fetchData = async () => {
  try {
      const res = await fetch("http://localhost:8000/users");
      const data = await res.json();
      return data;
  } catch (error) {
      const data = await db.users.toArray()
      return data
      // console.log(error)
  }
};

const createUI = (users) => {
  const userParrent = document.querySelector(".users-list");
  users.forEach((user) => {
    userParrent.insertAdjacentHTML(
      "beforeend",
      `
            <li class="plan user-parrent">
              <img src="../assets/images/bg.jpg" class="features__image" alt="" />
              <h2>${user.name}</h2>
              <p>Lorem ipsum dolor sit amet.</p>
            </li>
            `
    );
  });
};

window.addEventListener("load", async (event) => {
  const users = await fetchData();
  createUI(users);
});

//end fetch data
