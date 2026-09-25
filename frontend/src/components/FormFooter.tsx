import { Link } from "react-router-dom";


export default function FormFooter({text,href}:{text:string,href:string}) {
  return (
     <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}

          <Link to={href} className="text-indigo-600 hover:underline font-medium"
          >
            {text}
          </Link>

        </p>
  )
}
