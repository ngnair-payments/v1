interface CardProps {
    children: React.ReactNode;
  }
  
  export default function Card(props: CardProps) {
    return (
      <div className="bg-white p-6 shadow-lg rounded-md">
        {/* <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700">{content}</p> */}
        {props.children}
      </div>
    );
  }