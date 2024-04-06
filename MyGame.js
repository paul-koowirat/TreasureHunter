import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  PanResponder,
  Dimensions,
  Animated,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import GameOverDialog from "./GameOverDialog";
import ExitDialog from "./ExitDialog";

import { Audio } from "expo-av";
// exit game
import { BackHandler } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const BackgroundSound = "Background_1.mp3";

const gameOver = false;

const BackgroundImage = () => (
  <Image
    source={require("./assets/background.jpg")}
    style={{
      flex: 1,
      width: screenWidth,
      height: screenHeight,
      resizeMode: "cover",
      position: "absolute",
    }}
  />
);

const Player = ({ position }) => (
  <Image
    source={require("./assets/diver.png")}
    style={{
      width: 100,
      height: 150,
      position: "absolute",
      left: position.x,
      top: position.y,
    }}
  />
);

const treasureBoxImage = require("./assets/treasureboxsmall.png");

const TreasureBox = ({ position }) => {
  return (
    <Image
      source={treasureBoxImage}
      style={{
        width: 100,
        height: 100,
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    />
  );
};

const explodeImage1 = require("./assets/explode1.png");
const explodeImage2 = require("./assets/explode2.png");

//const bombImage = require("./assets/bomb3.png");

const bombImages = [
  require("./assets/bomb3.png"),
  require("./assets/bomb3.png"),
  // Add more frames as needed
];

const Bomb = ({ position }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // Start the animation loop
    const animationInterval = setInterval(updateFrame, 200); // Change frame every 200 milliseconds

    // Cleanup function to stop the animation loop on unmount
    return () => clearInterval(animationInterval);
  }, []);

  const updateFrame = () => {
    // Update the frame index to the next frame
    setFrameIndex((prevIndex) => (prevIndex + 1) % bombImages.length);
  };

  return (
    <Image
      source={bombImages[frameIndex]}
      style={{
        width: 80,
        height: 80,
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    />
  );
};

class MyGame extends Component {
  constructor(props) {
    super(props);

    const bombGenerateInterval = 2000;
    const bombMoveInterval = 100;

    this.state = {
      //playerPosition: { x: screenWidth / 2 - 25, y: screenHeight - 100 },
      playerPosition: { x: 300, y: 530 },
      bombs: [],
      treasureBoxPosition: { x: 30, y: 580 },
      totalScore: 0,
      //treasureBoxScore: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
      treasureBoxScore: this.generateTreasureBoxScore(),
      life: 3,
      explodeImage1Visible: false,
      explodeImage2Visible: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let x = this.state.playerPosition.x + gestureState.dx;
        if (x < 0) {
          x = 0; // Limit player to left edge of the screen
        } else if (x > screenWidth - 100) {
          x = screenWidth - 100; // Limit player to right edge of the screen
        }

        this.setState({
          playerPosition: {
            x,
            y: this.state.playerPosition.y,
          },
        });
      },
    });

    this.explosionAnimation = new Animated.Value(0); //Animation value for explosion

    //Background sound
    this.backgroundSound = new Audio.Sound();

    // sound objects
    this.soundObjects = [
      new Audio.Sound(), // bomb hit diver
      new Audio.Sound(), // bomb hit floor
      new Audio.Sound(), // bomb hit treasure box
      new Audio.Sound(), // player hit treasure box
      new Audio.Sound(), // treasure box move
    ];
  } // End constructor

  async componentDidMount() {
    // Start timers for bomb generation and dropping
    const bombGenerateInterval = 2000;
    const bombMoveInterval = 100;

    this.bombGenerationTimer = setInterval(
      this.generateBomb,
      bombGenerateInterval
    ); // Generate bomb every second
    //this.bombDropTimer = setInterval(this.dropBombs, 100); // Drop bombs every 0.5 seconds
    this.moveBombInterval = setInterval(this.moveBombs, bombMoveInterval);
    // Generate initial treasure box score
    this.generateTreasureBoxScore();

    //background sound
    try {
      //await this.backgroundSound.loadAsync(require("./sound/Background_1.mp3"));
      await this.backgroundSound.loadAsync(
        require(`./sound/${BackgroundSound}`)
      );
      await this.backgroundSound.setIsLoopingAsync(true);
      await this.backgroundSound.playAsync();
    } catch (error) {
      console.log("Failed to initialize background sound", error);
    }

    // mount sound effect objects
    try {
      await Promise.all([
        this.soundObjects[0].loadAsync(require("./sound/BombhitFloor.mp3")),
        this.soundObjects[1].loadAsync(require("./sound/BombhitTreasure.mp3")),
        this.soundObjects[2].loadAsync(require("./sound/BombhitPlayer.mp3")),
        this.soundObjects[3].loadAsync(
          require("./sound/PlayerhitTreasure.mp3")
        ),
        this.soundObjects[4].loadAsync(require("./sound/touch.mp3")),
      ]);
    } catch (error) {
      console.log("Failed to load sound effect", error);
    }
  }

  componentWillUnmount() {
    //clearInterval(this.interval);
    clearInterval(this.bombGenerationTimer);
    //clearInterval(this.bombDropTimer);
    clearInterval(this.moveBombInterval);

    // Stop and release sound when the component is unmounted
    this.soundObjects.forEach((soundObject) => soundObject.unloadAsync());
    //this.backgroundSound.unloadAsync();
  }

  // play Background sound
  handleBackgroundSound = async () => {
    try {
      //await this.backgroundSound.loadAsync(require("./sound/Background_1.mp3"));
      await this.backgroundSound.loadAsync(
        require(`./sound/${BackgroundSound}`)
      );
      await this.backgroundSound.setIsLoopingAsync(true);
      await this.backgroundSound.playAsync();
    } catch (error) {
      console.log("Failed to initialize background sound", error);
    }
  };

  //play sound effect function
  handlePlaySound = async (soundIndex) => {
    try {
      await this.soundObjects[soundIndex].setPositionAsync(0); // Reset sound position
      await this.soundObjects[soundIndex].playAsync();
    } catch (error) {
      console.log("Failed to play sound", error);
    }
  };

  generateTreasureBoxScore = () => {
    // Generate random score for the treasure box from 10 - 100
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    //const treasureBoxScore = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    //this.setState({ treasureBoxScore });
  };

  generateBomb = () => {
    const { life } = this.state;

    // Check if the player's life is greater than 0 before generating a new bomb
    if (life > 0) {
      // Implementation to generate a new bomb
      // For example:
      const newBomb = {
        //id: uuid(), // Generate unique id for the bomb
        id: Date.now(),
        position: { x: Math.random() * (screenWidth - 80), y: -20 }, // Generate random position above the screen
        //velocity: 5, // Example velocity
        velocity: Math.random() * 10 + 10,
      };

      // Update state to add the new bomb
      this.setState((prevState) => ({
        bombs: [...prevState.bombs, newBomb],
      }));
    }
  };

  // move bomb downward is modified to remove bomb at end screen
  moveBombs = () => {
    const {
      bombs,
      playerPosition,
      life,
      treasureBoxPosition,
      treasureBoxScore,
      totalScore,
    } = this.state;

    // Move bombs downward
    const newBombs = bombs.map((bomb) => ({
      ...bomb,
      position: { x: bomb.position.x, y: bomb.position.y + bomb.velocity },
    }));

    // Check for collisions with player and remove bombs beyond screen height
    const filteredBombs = newBombs.filter((bomb) => {
      if (
        bomb.position.x < playerPosition.x + 100 &&
        bomb.position.x + 40 > playerPosition.x &&
        bomb.position.y < playerPosition.y + 150 &&
        bomb.position.y + 40 > playerPosition.y
      ) {
        //play explosion sound
        this.handlePlaySound(2);

        // Reduce life by 1
        const newLife = life - 1;

        if (newLife === 0) {
          // Game over if life is 0
          clearInterval(this.dropBombInterval);
          clearInterval(this.moveBombInterval);
          this.setState({ life: newLife });
          //stop background sound
          this.backgroundSound.unloadAsync();
        } else {
          // Reset player position
          this.setState({
            life: newLife,
            //playerPosition: { x: 300, y: 530 }, //move player to default position
            explodeImage1Visible: true, // show explosion
          });

          // hide explosion afer few seconds
          setTimeout(() => {
            this.setState({ explodeImage1Visible: false });
          }, 120); // more delay effect the game
        }
        return false; // Remove bomb due to collision with player
      }
      // if bomb hit treasure box
      if (
        bomb.position.x < treasureBoxPosition.x + 100 &&
        bomb.position.x + 40 > treasureBoxPosition.x &&
        bomb.position.y + 80 > treasureBoxPosition.y &&
        bomb.position.y + 60 < treasureBoxPosition.y
      ) {
        // when bomb hits treasure box
        this.handlePlaySound(1);

        // update treasure box score
        let newTreasureBoxScore = treasureBoxScore - 10;
        if (newTreasureBoxScore <= 0) {
          newTreasureBoxScore = 0;
        }

        //show explosion when bomb hit treasure box
        this.setState({
          explodeImage2Position: { x: bomb.position.x, y: bomb.position.y },
          treasureBoxScore: newTreasureBoxScore,
          explodeImage2Visible: true,
        });

        // hide explosion afer few seconds
        setTimeout(() => {
          this.setState({ explodeImage2Visible: false });
        }, 120); // more delay effect the game
      }

      // check bomb touch sea floor
      else if (bomb.position.y > screenHeight - 100) {
        //Bomb hit sea floor
        this.handlePlaySound(0);
        //show explosion when bomb hit sea floor
        this.setState({
          explodeImage2Position: { x: bomb.position.x, y: bomb.position.y },
          explodeImage2Visible: true,
        });

        // hide explosion afer few seconds
        setTimeout(() => {
          this.setState({ explodeImage2Visible: false });
        }, 120); // more delay effect the game

        return false; //  Remove bomb beyond screen height
      }

      return true; // Keep bomb within screen height
      //return bomb.position.y <= screenHeight - 150; // Keep bomb within screen height
    });

    // Update state with new bomb positions
    this.setState({ bombs: filteredBombs });

    if (
      playerPosition.x < treasureBoxPosition.x + 50 &&
      playerPosition.x + 50 > treasureBoxPosition.x &&
      playerPosition.y < treasureBoxPosition.y + 100 &&
      playerPosition.y + 150 > treasureBoxPosition.y
    ) {
      //Player hit Treasure box
      this.handlePlaySound(3);

      // Move treasure box randomly within the screen width
      const newTreasureBoxPosition = {
        //x: 200,
        x: Math.max(
          0,
          Math.min(screenWidth - 100, Math.random() * screenWidth)
        ),
        y: treasureBoxPosition.y, // Keep the same y position
      };

      //Treasure box moves
      this.handlePlaySound(4);

      // Regenerate random score for treasure box
      /*const newTreasureBoxScore =
        Math.floor(Math.random() * (200 - 50 + 1)) + 50;     
        this.setState({ treasureBoxScore: newTreasureBoxScore }); */
      const newTreasureBoxScore = this.generateTreasureBoxScore();
      // Update total score
      const newTotalScore = totalScore + treasureBoxScore;

      this.setState({
        treasureBoxPosition: newTreasureBoxPosition,
        treasureBoxScore: newTreasureBoxScore,
        totalScore: newTotalScore,
      });
    }
  };

  render() {
    const {
      //explosion1Visible,
      explodeImage1Visible,
      explodeImage2Visible,
      //explosion2Visible,
      playerPosition,
      explodeImage2Position,
      life,
      totalScore,
      treasureBoxScore,
      treasureBoxPosition,

      //handlePlaySound1,
      //handlePlaySound2,
      //backgroundSound,
    } = this.state;

    return (
      <GameEngine style={{ flex: 1 }}>
        <View style={{ flex: 1 }} {...this.panResponder.panHandlers}>
          <BackgroundImage />
          <Player position={this.state.playerPosition} />

          <TreasureBox position={this.state.treasureBoxPosition} />
          {treasureBoxScore >= 0 && (
            <Text
              style={{
                position: "absolute",
                top: treasureBoxPosition.y - 30,
                left: treasureBoxPosition.x + 50,
                color: "black",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {treasureBoxScore}
            </Text>
          )}

          {explodeImage1Visible && (
            <Image
              source={explodeImage1}
              style={{
                position: "absolute",
                left: playerPosition.x,
                top: playerPosition.y,
                width: 80,
                height: 80,
              }}
            />
          )}

          {explodeImage2Visible && (
            <Image
              source={explodeImage2}
              style={{
                position: "absolute",
                left: explodeImage2Position.x,
                top: explodeImage2Position.y,
                width: 50,
                height: 50,
              }}
            />
          )}
          {this.state.bombs.map((bomb) => (
            <Bomb key={bomb.id} position={bomb.position} />
          ))}

          <Text
            style={{
              position: "absolute",
              top: 30,
              right: 20,
              color: "darkgreen",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Life: {life}
          </Text>

          <Text
            style={{
              position: "absolute",
              top: 30,
              left: 20,
              color: "darkgreen",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Score: {totalScore}
          </Text>
        </View>

        {/* Game Over dialog */}
        {life === 0 && (
          <GameOverDialog
            onRestart={() => {
              //start background sound
              this.handleBackgroundSound();

              // Clear the bomb array
              this.setState({ bombs: [] });
              // Clear existing intervals
              clearInterval(this.moveBombInterval);

              this.setState({
                //playerPosition: { x: screenWidth / 2 - 25, y: screenHeight - 100 },
                playerPosition: { x: 300, y: 530 },
                bombs: [],
                treasureBoxPosition: { x: 30, y: 580 },
                totalScore: 0,
                //treasureBoxScore: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                treasureBoxScore: this.generateTreasureBoxScore(),
                life: 3,
                //explodeImage1Visible: false,
                //explodeImage2Visible: false,
              });

              // Start timers for bomb generation and dropping

              this.moveBombInterval = setInterval(this.moveBombs, 100);

              // Generate initial treasure box score
              this.generateTreasureBoxScore();
            }} //end restart
            onExit={() => {
              // call Exit Dialog
              this.props.navigation.navigate("Exit", { totalScore });
              // for IOS, use standard close app
              //BackHandler.exitApp();
            }}
          />
        )}
      </GameEngine>
    );
  }
}

export default MyGame;
