import CardWrapper from "./card-wrapper"

const ErrorCard = () => {
  return (
    <CardWrapper 
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
      children
    />
  );
};

export default ErrorCard