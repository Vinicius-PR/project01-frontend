interface ResetPasswordEmailTemplateProps {
  email: string,
  resetPasswordToken: string
}

export default function ResetPasswordEmailTemplate({email, resetPasswordToken}: ResetPasswordEmailTemplateProps) {
  return (
    <div>
      <h1>Reset Password for <b>{email}</b></h1>
      <p>
        To reset you passord, click on this link below. It will expire after 25 minutes.
      </p>
      <a href={`http://localhost:3000/changePassWord?token=${resetPasswordToken}`}>
        Click here to reset your password
      </a>
    </div>
  )
}