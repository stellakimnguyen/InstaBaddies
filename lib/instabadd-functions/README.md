- cd instabadd-functions
- firebase deploy
- will yield a URL : https://us-central1-instabadd-3c56a.cloudfunctions.net/helloWorld
- open postman and make get request to this URL, no body
  should receive index.js helloworld function response

- firebase serve will serv the application locally, can save then serve immediately - faster tahn deploy. It uses your machine as the endpoint

- for each function exported, will see in firebase with an associated URL

# SIGNUP

{
"username": "user20",
"password": "efwefwegfew",
"confirmPassword": "efwefwegfew",
"email": "user20@gmail.com"
}

- email must be unique by default in firebase
- firebase doesn't store more than email, time of creation and USer ID

  - so we want to create a collection called users that will store
    this UID that references an account
    in addition to other details like username, posts, etc

- whenever someone signs up, we need to look through USERS collection
  to check the username & Email is NOT taken.

  # LOGIN

  {
  "password": "efwefwegfew",
  "email": "user20@gmail.com"
  }

# POST

{
"body": "a bodyy of a post"
}

- in order to use an export.myfunction from index.js, need to ensure function doesn't already exist in firebase by cd into functions folder then `firebase functions:delete myFunction`
- then in same folder `firebase deploy`, no need for `firebase serve` to use this exported function after deploying it.
- to run export functions along with local server : `firebase serve --only functions,firestore`

- whenever you make a change to a firebase cloud function or package.json dependencies, you need to `firebase deploy`
  in order to run it and use associated dependencies. https://stackoverflow.com/questions/47245506/firebase-error-parsing-triggers-cannot-find-module-request-promise-simple-cl

- to debug a firebase request from the browser, go onto firebase functions logs :
  in the firebase dashboard => functions => logs. Check the error message. Filter by error
