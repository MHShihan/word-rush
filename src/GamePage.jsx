import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgm from "./assets/audio/bgm_cut.mp3";
import { MdMusicNote } from "react-icons/md";
import { MdMusicOff } from "react-icons/md";

// List of Bangladeshi cities
const CITIES = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

// Sound effects (using base64 encoded short audio)

const Balloon = ({ letter, onPop, position }) => (
  <div
    className="absolute w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer transition-transform"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `translate(-50%, -50%)`,
      animation: `float ${8 + Math.random() * 4}s infinite ease-in-out`,
    }}
    onClick={() => onPop(letter)}
  >
    {letter}
  </div>
);

const GamePage = () => {
  const [currentCity, setCurrentCity] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState("playing");
  const [balloons, setBalloons] = useState([]);

  // Audion State
  const [isBGMPlaying, setIsBGMPlaying] = useState(true);
  const [audioBGM, setAudioBGM] = useState();

  // Sound effects
  useEffect(() => {
    const newAudio = new Audio(bgm);
    newAudio.loop = true;
    newAudio.volume = 0.5;

    setAudioBGM(newAudio);
  }, []);

  const toggleMusic = () => {
    if (isBGMPlaying) {
      audioBGM.play();
    } else {
      audioBGM.pause();
      audioBGM.currentTime = 0;
    }
  };

  const handleOnClick = () => {
    setIsBGMPlaying(!isBGMPlaying);
    toggleMusic();
  };

  const handlePop = (letter) => {
    if (gameStatus !== "playing") return;

    const expectedLetter = currentCity[selectedLetters.length];

    if (letter === expectedLetter) {
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);

      if (newSelected.join("") === currentCity) {
        setIsBGMPlaying(false);
        toggleMusic();
        setGameStatus("won");
      }
    }
  };

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    setCurrentCity(city);
    setSelectedLetters([]);
    setTimeLeft(5);
    setGameStatus("playing");
    generateBalloons(city);
  };

  const generateBalloons = (city) => {
    const cityLetters = city.split("");
    const allLetters = [...cityLetters];

    // Add random letters until we have 15 balloons
    while (allLetters.length < 15) {
      const randomChar = String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
      if (!allLetters.includes(randomChar)) {
        allLetters.push(randomChar);
      }
    }

    const shuffled = allLetters.sort(() => Math.random() - 0.5);
    const newBalloons = shuffled.map((letter) => ({
      letter,
      position: {
        x: Math.random() * 90 + 5,
        y: Math.random() * 70 + 15,
      },
    }));

    setBalloons(newBalloons);
  };

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus("lost");
          clearInterval(timer);
          setIsBGMPlaying(false);
          toggleMusic();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  return (
    <div className="h-[100vh] bg-gradient-to-r from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Game Info */}
      <div className="p-4 flex justify-between">
        <div className="text-cyan-400 font-bold text-3xl font-mono">
          {currentCity}
        </div>
        {/* Selected Letters */}
        <div className="text-cyan-400  text-4xl font-mono text-center  mt-4">
          {selectedLetters.join(" ")}
        </div>

        <div className="flex  justify-center gap-2 ">
          <div className="text-cyan-400 font-mono  text-xl font-bold">
            Time: {timeLeft}s
          </div>
          <button className=" text-purple-500 rounded-full mb-2">
            {isBGMPlaying ? (
              <MdMusicNote
                onClick={handleOnClick}
                className="text-xl cursor-pointer"
              />
            ) : (
              <MdMusicOff
                onClick={handleOnClick}
                className="text-[16px] cursor-pointer"
              />
            )}
          </button>
        </div>
      </div>
      {/* Balloons */}
      <div>
        {balloons.map((balloon, i) => (
          <Balloon
            key={i}
            letter={balloon.letter}
            position={balloon.position}
            onPop={handlePop}
          />
        ))}

        {/* Popups */}
        {gameStatus !== "playing" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">
                {gameStatus === "won" ? "Congratulations!" : "Time's Up!"}
              </h2>
              <div className="flex gap-10">
                {/* Status Button */}
                <button
                  onClick={startNewGame}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Play Again
                </button>
                {/* Exit Button */}
                <Link to="/">
                  <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 cursor-pointer">
                    Exit!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(-50%, -50%) translateY(0);
            }
            50% {
              transform: translate(-50%, -50%) translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GamePage;
