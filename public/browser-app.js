const formDOM = document.querySelector(".form");
const usernameInputDOM = document.querySelector(".username-input");
const passwordInputDOM = document.querySelector(".password-input");
const formAlertDOM = document.querySelector(".form-alert");
const resultDOM = document.querySelector(".result");
const btnDOM = document.querySelector("#data");
const tokenDOM = document.querySelector(".token");

formDOM.addEventListener("submit", async e => {
  formAlertDOM.classList.remove("text-success");
  tokenDOM.classList.remove("text-success");

  e.preventDefault();
  const username = usernameInputDOM.value;
  const password = passwordInputDOM.value;

  try {
    const res = await axios("http://localhost:3000/graphql", {
      method: "post",
      data: {
        query: `
          query {
            login(username: ${JSON.stringify(
              username
            )}, password: ${JSON.stringify(password)}) {
              username
              password
              token
            }
          }
      `,
      },
    });

    const data = res.data.data.login;

    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "You've logged in successfully!";

    formAlertDOM.classList.add("text-success");
    usernameInputDOM.value = "";
    passwordInputDOM.value = "";

    localStorage.setItem("token", data.token);
    resultDOM.innerHTML = "";
    tokenDOM.textContent = "token present";
    tokenDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = error.response.data.msg;
    localStorage.removeItem("token");
    resultDOM.innerHTML = "";
    tokenDOM.textContent = "no token present";
    tokenDOM.classList.remove("text-success");
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
  }, 2000);
});

btnDOM.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  console.log(token);

  try {
    const res = await axios(
      "http://localhost:3000/graphql",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          query: `
          query {
            dashboard {
              msg
              secret
            }
          }
      `,
        },
      },
      {}
    );

    const data = res.data.data.dashboard;

    resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`;

    data.secret;
  } catch (error) {
    localStorage.removeItem("token");
    resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`;
  }
});

const checkToken = () => {
  tokenDOM.classList.remove("text-success");

  const token = localStorage.getItem("token");
  if (token) {
    tokenDOM.textContent = "token present";
    tokenDOM.classList.add("text-success");
  }
};
checkToken();
