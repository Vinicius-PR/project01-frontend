interface ResetPasswordEmailTemplateProps {
  name: string,
}

export default function WelcomeUserEmailTemplate({name}: ResetPasswordEmailTemplateProps) {
  return (
    <div>
      <h1>Welcome <b>{name}</b></h1>
      <p>
        Enjoy the project 01. Your account is <b>activated</b> now. Have a good time o/
      </p>
      <a href={`http://localhost:3000/sign-in`}>
        Click here to log in
      </a>
    </div>
  )
}