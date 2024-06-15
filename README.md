## Login

To do the login are using

* Next Auth
* Prisma
* Supabase

## Roud map to sing-up / sing-in:

First of all the user need to sing-in. If the user doesn't have an account, he must create one.
On sign-up page, the user must put his details to register. When he click on the button to sign-up, his date will be save and an email will be sent to activate account.

# Sign-up Logic:

* When user click sing-up button, a **handle submit** function will run, calling an api endpoint to _/api/user_. using POST method. The form data will be sent.
* Then will check if user already exist inside the supabase database, checking if there is someone with same email or username.
* If the user is new, a hashed password will be created and then the data will be saved
* Also an _activate token_ will be created. This token will be used to create an URL and send this URL to his email.
* Then an email will be sent using this token. He must to click this link to activate. Otherwise, his account won't be active and he won't be able to log in.
* After he click the link, the user will receive an welcome email and his account will be active.

# Sign-in Logic:

* The only way to user sign-in is to sign-up first and activate his account. Inside the **authorize** function _(At api/auth/[...nextauth]/options.ts)_ will check if the **active** prop of user is true. If is not, an error will be thrown and user won't log in.
* Also this same function will check if user exist and also if password is correct.
* If success, the user will be redirect to home page with his account logged.

## Forgot password Logic:

* To reset password, user must provide the correct email. It will check if email is realy an email.
* If email format is right, a POST API endpoint at _api/resetPassword_ will be called.
* There will check if user exist. If not, an error message will appear to indicate that the user doesn't exist.
* Otherwise, an token and an expire date of 25 minutes will be create. This token will be used to create  a link.
* A link will be sent using Resend. The user have 25 minutos to go to his email and click the link.
* Then he will provide a new password and click the button to change. When he clicks this button, a POST API endpoit will be called at _api/changePassword_ passing the new password.
* Again will check if the user exist. If exist, an new hashed password will be create and the user info will be updated. The token will be erased (to avoid an second try) and the expire date will be null
* If success, the user will be redirected to sign-in page.

