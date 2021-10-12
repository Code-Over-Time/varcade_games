const screenW = 960
const screenH = 640

const globalLayoutData = {
  screenWidth: screenW,
  screenHeight: screenH,
  halfScreenWidth: screenW / 2,
  halfScreenHeight: screenH / 2
}

const sceneLayoutData = {

  // Scene specific layout configurations
  sceneLayouts: {

    LoadingScene: {
      ui: {
        text: {
          originX: 0.5,
          originY: 0.5,
          bitmapFontId: 'verdana64',
          color: 0xFF0000,
          fontSize: 48,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight
        }
      }
    },

    MainMenuScene: {
      ui: {
        background: {
          originX: 0,
          originY: 0,
          x: 0,
          y: 0
        },
        menu: {
          originX: 0.5,
          originY: 0.5,
          bitmapFontId: 'verdana64',
          color: 0xFF0000,
          fontSize: 48,
          // x and y here are a reference point.
          // THe main menu has multiple options, this
          // Simple dictates where the first one is.
          // The seen needs to calculate the position
          // of subsequent entities itself
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight + 200,
          padding: 30,
          fistIndicatorX: 260,
          fistIndicatorYOffset: -8
        },
        settingsList: {
          icons: {
            soundOffIcon: 'music_off',
            soundOnIcon: 'music_on',
            effectsOffIcon: 'sound_off',
            effectsOnIcon: 'sound_on'
          },
          x: globalLayoutData.screenWidth - 30,
          y: globalLayoutData.halfScreenHeight + 230,
          padding: 60,
          originX: 0.5,
          originY: 0.5
        }
      }
    },

    MatchmakerScene: {
      ui: {
        header: {
          originX: 0.5,
          originY: 0.5,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight,
          color: 0xFF0000,
          bitmapFontId: 'verdana64',
          fontSize: 32
        }
      }
    },

    CharacterSelectScene: {
      ui: {
        background: {
          originX: 0,
          originY: 0,
          x: 0,
          y: 0
        },
        header: {
          originX: 0,
          originY: 0,
          x: globalLayoutData.halfScreenWidth + 10,
          y: 15,
          color: 0xFF0000,
          bitmapFontId: 'verdana64',
          fontSize: 32
        },
        headshots: {
          originX: 0,
          originY: 0,
          x: globalLayoutData.halfScreenWidth + 10,
          y: 60,
          padding: 15,
          height: 100,
          width: 100,
          maxPerRow: 3
        },
        character: {
          x: 0,
          y: globalLayoutData.screenHeight,
          originX: 0,
          originY: 1.0,
          width: globalLayoutData.screenWidth,
          height: globalLayoutData.screenHeight
        },
        fightButton: {
          x: globalLayoutData.halfScreenWidth * 1.5,
          y: globalLayoutData.screenHeight - 34,
          originX: 0.5,
          originY: 0.5,
          bitmapFontId: 'MedievalSharp64',
          fontSize: 48,
          color: 0xFF0000
        },
        characterInfo: {
          x: globalLayoutData.halfScreenWidth + 10,
          y: globalLayoutData.halfScreenHeight - 10,
          originX: 0,
          originY: 0,
          width: globalLayoutData.halfScreenWidth - 20,
          height: globalLayoutData.halfScreenHeight - 70,
          color: 0x000000,
          alpha: 0.75,
          cornerRadius: 10,
          header: {
            originX: 0,
            originY: 0,
            x: globalLayoutData.halfScreenWidth + 20,
            y: globalLayoutData.halfScreenHeight,
            bitmapFontId: 'verdana64',
            fontSize: 36,
            flag: {
              originX: 0,
              originY: 0,
              sidePadding: 15,
              y: globalLayoutData.halfScreenHeight
            }
          },
          atkStats: {
            originX: 0,
            originY: 0,
            x: globalLayoutData.halfScreenWidth + 20,
            y: globalLayoutData.halfScreenHeight + 45,
            padding: 42,
            bitmapFontId: 'verdana64',
            fontSize: 22,
            statList: {
              iconScale: 0.8,
              originX: 0,
              originY: 1, // This is a little hacky. The icon gets rotated so {0,1} becomes {0,0}
              x: globalLayoutData.halfScreenWidth + 20,
              y: globalLayoutData.halfScreenHeight + 85,
              padding: 55,
              sidePadding: 70,
              textOffset: 30
            }
          },
          defStats: {
            originX: 0,
            originY: 0,
            x: globalLayoutData.halfScreenWidth + (globalLayoutData.halfScreenWidth / 2) + 40,
            y: globalLayoutData.halfScreenHeight + 45,
            iconScale: 1.0,
            padding: 42,
            bitmapFontId: 'verdana64',
            fontSize: 22,
            statList: {
              iconScale: 0.8,
              originX: 0,
              originY: 1, // This is a little hacky. The icon gets rotated so {0,1} becomes {0,0}
              x: globalLayoutData.halfScreenWidth + (globalLayoutData.halfScreenWidth / 2) + 40,
              y: globalLayoutData.halfScreenHeight + 85,
              padding: 55,
              sidePadding: 70,
              textOffset: 30
            }
          },
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          yTranslationDistance: globalLayoutData.halfScreenHeight
        }
      },
      graphics: {
        selectedCharacter: {

        },
        characterList: {

        }
      }
    },

    BattleScene: {
      ui: {
        background: {
          originX: 0.5,
          originY: 0.5,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight
        },
        p1: {
          name: {
            x: 20,
            y: 10,
            bitmapFontId: 'verdana64',
            fontSize: 24,
            originX: 0,
            originY: 0
          },
          healthbar: {
            x: 20,
            y: 35,
            w: globalLayoutData.halfScreenWidth - 40,
            h: 20,
            padding: 5,
            direction: 'ltr'
          },
          winIndicators: {
            x: globalLayoutData.halfScreenWidth - 20,
            y: 60,
            paddingLeft: 50,
            paddingRight: 0,
            originX: 0.0, // Need to account for rotation here (origin gets rotated too)
            originY: 0.0,
            scale: 0.75,
            tint: 0xFF0000,
            rotation: 1.5
          }
        },
        p2: {
          name: {
            x: globalLayoutData.screenWidth - 20,
            y: 10,
            bitmapFontId: 'verdana64',
            fontSize: 24,
            originX: 1.0,
            originY: 0.0
          },
          healthbar: {
            x: globalLayoutData.halfScreenWidth + 20,
            y: 35,
            w: globalLayoutData.halfScreenWidth - 40,
            h: 20,
            padding: 5,
            direction: 'rtl'
          },
          winIndicators: {
            x: globalLayoutData.halfScreenWidth + 20,
            y: 70,
            paddingLeft: 0,
            paddingRight: 50,
            originX: 0.0, // Need to account for rotation here (origin gets rotated too)
            originY: 1.0,
            scale: 0.75,
            tint: 0xFF0000,
            rotation: 1.5
          }
        },
        roundLifecycle: {
          header: {
            x: globalLayoutData.halfScreenWidth,
            y: 130,
            bitmapFontId: 'verdana64',
            fontSize: 32,
            originX: 0.5,
            originY: 0.5,
            color: 0xFF0000
          },
          count: {
            x: globalLayoutData.halfScreenWidth,
            y: globalLayoutData.halfScreenHeight,
            bitmapFontId: 'MedievalSharp64',
            fontSize: 64,
            originX: 0.5,
            originY: 0.5,
            color: 0xFF0000
          },
          roundEndMessage: {
            header: {
              x: globalLayoutData.halfScreenWidth,
              y: 120,
              bitmapFontId: 'verdana64',
              fontSize: 64,
              originX: 0.5,
              originY: 0.5
            },
            body: {
              x: globalLayoutData.halfScreenWidth,
              y: 180,
              bitmapFontId: 'verdana64',
              fontSize: 48,
              originX: 0.5,
              originY: 0.5

            }
          }
        },
        weaponSelectLifecycle: {
          header: {
            x: globalLayoutData.halfScreenWidth,
            y: 130,
            bitmapFontId: 'verdana64',
            fontSize: 48,
            originX: 0.5,
            originY: 0.5,
            color: 0xFF0000
          },
          count: {
            x: globalLayoutData.halfScreenWidth,
            y: globalLayoutData.halfScreenHeight,
            bitmapFontId: 'MedievalSharp64',
            fontSize: 86,
            originX: 0.5,
            originY: 0.5,
            color: 0xFF0000
          },
          rockSelect: {
            x: globalLayoutData.halfScreenWidth - 150,
            y: globalLayoutData.halfScreenHeight * 1.75,
            originX: 0.5,
            originY: 0.5
          },
          paperSelect: {
            x: globalLayoutData.halfScreenWidth,
            y: globalLayoutData.halfScreenHeight * 1.75,
            originX: 0.5,
            originY: 0.5
          },
          scissorsSelect: {
            x: globalLayoutData.halfScreenWidth + 150,
            y: globalLayoutData.halfScreenHeight * 1.75,
            originX: 0.5,
            originY: 0.5
          }
        }
      },
      graphics: {
        p1: {
          x: (globalLayoutData.halfScreenWidth * 0.5) - 100,
          y: globalLayoutData.halfScreenHeight,
          originX: 0.5,
          originY: 0.5,
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          xTranslationDuration: 800,
          xTranslationEase: 'Expo.easeOut',
          scale: 0.5,
          zoom: {
            x: 100,
            y: globalLayoutData.screenHeight - 100
          }
        },
        p2: {
          x: (globalLayoutData.halfScreenWidth * 1.5) + 100,
          y: globalLayoutData.halfScreenHeight,
          originX: 0.5,
          originY: 0.5,
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          xTranslationDuration: 800,
          xTranslationEase: 'Expo.easeOut',
          scale: 0.5,
          zoom: {
            x: globalLayoutData.screenWidth - 100,
            y: globalLayoutData.screenHeight - 100
          }
        },
        characterSpecificOffsets: {
          man: {
            xZoomed: 0,
            yZoomed: 0
          },
          hog: {
            xZoomed: 50,
            yZoomed: -100
          },
          aru: {
            xZoomed: 50,
            yZoomed: -50
          },
          mai: {
            xZoomed: 0,
            yZoomed: 0
          },
          rad: {
            xZoomed: 0,
            yZoomed: 0
          }
        },
        bgZoomScale: 2.0,
        bgZoomAlpha: 0.5,
        characterZoomScale: 1.0,
        zoomDuration: 4000
      }
    },

    PostFightScene: {
      ui: {
        background: {
          x: 0,
          y: 0,
          originX: 0,
          originY: 0
        },
        header: {
          x: globalLayoutData.halfScreenWidth,
          y: 15,
          originX: 0.5,
          originY: 0.0,
          bitmapFontId: 'verdana64',
          fontSize: 64,
          color: 0xFF0000
        },
        mainMenu: {
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.screenHeight - 50,
          originX: 0.5,
          originY: 0.0,
          bitmapFontId: 'verdana64',
          fontSize: 32,
          color: 0xFF0000
        },
        characterUnlock: {
          x: globalLayoutData.halfScreenWidth,
          y: 80,
          originX: 0.5,
          originY: 0.0,
          bitmapFontId: 'verdana64',
          fontSize: 28,
          color: 0xFF0000
        },
        containers: {
          winTint: 0x00FF00,
          loseTint: 0xFF0000,
          winAlpha: 0.1,
          loseAlpha: 0.1
        },
        p1: {
          x: globalLayoutData.halfScreenWidth * 0.5,
          y: globalLayoutData.halfScreenHeight - 20,
          originX: 0.5,
          originY: 0.5,
          container: {
            x: -10,
            y: globalLayoutData.halfScreenHeight * 0.5 - 30,
            width: globalLayoutData.halfScreenWidth + 10,
            height: globalLayoutData.screenHeight * 0.68,
            cornerRadius: 10
          },
          trashTalk: {
            x: globalLayoutData.halfScreenWidth * 0.5,
            y: globalLayoutData.screenHeight * 0.71,
            originX: 0.5,
            originY: 0.0,
            maxWidth: globalLayoutData.halfScreenWidth * 0.8,
            bitmapFontId: 'verdana64',
            fontSize: 28
          }
        },
        p2: {
          x: globalLayoutData.halfScreenWidth * 1.5,
          y: globalLayoutData.halfScreenHeight - 20,
          originX: 0.5,
          originY: 0.5,
          container: {
            x: globalLayoutData.halfScreenWidth,
            y: globalLayoutData.halfScreenHeight * 0.5 - 30,
            width: globalLayoutData.halfScreenWidth + 10,
            height: globalLayoutData.screenHeight * 0.68,
            cornerRadius: 10
          },
          trashTalk: {
            x: globalLayoutData.halfScreenWidth * 1.5,
            y: globalLayoutData.screenHeight * 0.71,
            originX: 0.5,
            originY: 0.0,
            maxWidth: globalLayoutData.halfScreenWidth * 0.8,
            bitmapFontId: 'verdana64',
            fontSize: 28
          }
        }
      }
    },

    VSScene: {
      ui: {
        background: {
          originX: 0,
          originY: 0,
          x: 0,
          y: 0
        },
        vsIcon: {
          originX: 0.5,
          originY: 0.5,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight
        }
      },
      graphics: {
        p1: {
          x: 0,
          y: globalLayoutData.screenHeight,
          originX: 0,
          originY: 1.0,
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          xTranslationDuration: 500,
          name: {
            x: globalLayoutData.halfScreenWidth,
            y: 164,
            originX: 0.5,
            originY: 0.5,
            xTranslationDistance: globalLayoutData.halfScreenWidth,
            xTranslationDuration: 500,
            bitmapFontId: 'MedievalSharp64',
            color: 0xFF0000,
            fontSize: 64
          },
          mask: [
            { x: 0, y: 0 },
            { x: 0, y: globalLayoutData.screenHeight },
            { x: 300, y: globalLayoutData.screenHeight },
            { x: globalLayoutData.screenWidth - 300, y: 0 }
          ]
        },
        p2: {
          x: globalLayoutData.screenWidth,
          y: globalLayoutData.screenHeight,
          originX: 1.0,
          originY: 1.0,
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          xTranslationDuration: 500,
          name: {
            x: globalLayoutData.halfScreenWidth,
            y: globalLayoutData.screenHeight - 164,
            originX: 0.5,
            originY: 0.5,
            xTranslationDistance: globalLayoutData.halfScreenWidth,
            xTranslationDuration: 500,
            bitmapFontId: 'MedievalSharp64',
            color: 0xFF0000,
            fontSize: 64
          },
          mask: [
            { x: globalLayoutData.screenWidth, y: 0 },
            { x: globalLayoutData.screenWidth, y: globalLayoutData.screenHeight },
            { x: 300, y: globalLayoutData.screenHeight },
            { x: globalLayoutData.screenWidth - 300, y: 0 }
          ]
        },
        unknownOpponent: {
          x: globalLayoutData.halfScreenWidth * 1.6,
          y: globalLayoutData.halfScreenHeight,
          originX: 0.5,
          originY: 0.5,
          bitmapFontId: 'MedievalSharp64',
          fontSize: 48,
          maxWidth: globalLayoutData.halfScreenWidth * 0.6,
          color: 0xFF0000,
          xTranslationDistance: globalLayoutData.halfScreenWidth,
          xTranslationDuration: 500
        }
      }
    },

    StoryIntroScene: {
      ui: {
        storyText: {
          originX: 0.5,
          originY: 0,
          maxWidth: globalLayoutData.screenWidth - 200,
          bitmapFontId: 'verdana64',
          color: 0xFFFFFF,
          fontSize: 22,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.screenHeight,
          scrollDuration: 35000
        },
        skipButton: {
          icons: {
            fastForwardIcon: 'scissors_ico'
          },
          x: globalLayoutData.screenWidth - 40,
          y: globalLayoutData.screenHeight - 30,
          originX: 0.5,
          originY: 0.5,
          scale: 0.75
        }
      }
    },

    CharacterIntroScene: {
      ui: {
        storyText: {
          originX: 0.5,
          originY: 0,
          maxWidth: globalLayoutData.screenWidth - 200,
          bitmapFontId: 'verdana64',
          color: 0xFFFFFF,
          fontSize: 22,
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.screenHeight,
          scrollDuration: 40000
        },
        characterName: {
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.halfScreenHeight,
          originX: 0.5,
          originY: 0.5,
          bitmapFontId: 'verdana64',
          fontSize: 32
        },
        skipButton: {
          icons: {
            fastForwardIcon: 'scissors_ico'
          },
          x: globalLayoutData.screenWidth - 40,
          y: globalLayoutData.screenHeight - 30,
          originX: 0.5,
          originY: 0.5,
          scale: 0.75
        },
        background: {
          originX: 0,
          originY: 0,
          x: 0,
          y: 0
        }
      },
      graphics: {

      }
    },

    GameOverScene: {
      ui: {
        header: {
          x: globalLayoutData.halfScreenWidth,
          y: 50,
          originX: 0.5,
          originY: 0.0,
          maxWidth: globalLayoutData.screenWidth * 0.75,
          bitmapFontId: 'verdana64',
          fontSize: 64
        },
        body: {
          x: globalLayoutData.halfScreenWidth,
          y: 150,
          originX: 0.5,
          originY: 0,
          maxWidth: globalLayoutData.screenWidth * 0.75,
          bitmapFontId: 'verdana64',
          fontSize: 22
        },
        credits: {
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.screenHeight,
          originX: 0.5,
          originY: 0,
          maxWidth: globalLayoutData.screenWidth * 0.75,
          bitmapFontId: 'verdana64',
          fontSize: 22
        },
        menuButton: {
          x: globalLayoutData.halfScreenWidth,
          y: globalLayoutData.screenHeight - 48,
          originX: 0.5,
          originY: 0.5,
          color: 0xFF0000,
          bitmapFontId: 'verdana64',
          fontSize: 24
        }
      },
      graphics: {

      }
    }
  }
}

const modalLayoutData = {

  Error: {

    window: {
      x: globalLayoutData.halfScreenWidth * 0.5,
      y: globalLayoutData.halfScreenHeight * 0.5,
      w: globalLayoutData.halfScreenWidth,
      h: globalLayoutData.halfScreenHeight
    },
    ui: {
      header: {
        originX: 0.5,
        originY: 0,
        x: globalLayoutData.halfScreenWidth * 0.5,
        y: 20,
        color: 0xFF0000,
        bitmapFontId: 'verdana64',
        fontSize: 32
      },
      message: {
        originX: 0.5,
        originY: 0,
        x: globalLayoutData.halfScreenWidth * 0.5,
        y: 80,
        maxWidth: globalLayoutData.halfScreenWidth * 0.8,
        color: 0xFFFFFF,
        bitmapFontId: 'verdana64',
        fontSize: 18
      },
      closeButton: {
        originX: 0.5,
        originY: 1.0,
        x: globalLayoutData.halfScreenWidth * 0.5,
        y: globalLayoutData.halfScreenHeight - 20,
        color: 0xFF0000,
        bitmapFontId: 'verdana64',
        fontSize: 24
      }
    }

  }
}

function getSceneLayoutData (sceneName) {
  return sceneLayoutData.sceneLayouts[sceneName]
}

function getModalLayoutData (modalName) {
  return modalLayoutData[modalName]
}

exports.globalLayoutData = globalLayoutData
exports.getSceneLayoutData = getSceneLayoutData
exports.getModalLayoutData = getModalLayoutData
