import { useState, useEffect } from "react";

const Typewriter = ({ text }) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setTypedText((prevTypedText) => prevTypedText + text[index]);
      index++;

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 100); // Adjust the interval speed as needed

    return () => clearInterval(intervalId);
  }, [text]);

  return <div>{typedText}</div>;
};

export default Typewriter;
