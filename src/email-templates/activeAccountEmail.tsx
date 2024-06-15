interface ActiveAccountEmailTemplateProps {
  name: string,
  activateToken: string
}

export default function ActiveAccountEmailTemplate({name, activateToken}: ActiveAccountEmailTemplateProps) {
  return (
    <div>
      <h1>Hello <b>{name}</b></h1>
      <p>
        Welcome to Projet 01. Click the link below to active your account. The link will expire in 24 hours.
      </p>
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/api/activate/${activateToken}`}>
        Click here to active your account
      </a>
    </div>
  )
}