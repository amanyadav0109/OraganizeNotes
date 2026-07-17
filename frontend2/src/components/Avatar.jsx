function Avatar({ name, email, size = 40 }) {

  const letter = (name?.[0] || email?.[0] || "U").toUpperCase();

  return (
    <div
      className="bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size / 2.5,
      }}
    >
      {letter}
    </div>
  );
}

export default Avatar;