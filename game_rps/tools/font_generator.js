// Generates 4 bitmap font images and xml files.


// const generator = require('@rtpa/phaser-bitmapfont-generator');

var head = document.getElementsByTagName('HEAD')[0]
var link = document.createElement('link')
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = `style.css`

// Append link element to HTML head
head.appendChild(link); 

(async ()=>{

    await generator.TextStyle2BitmapFont(
        {
            path: './font_output',
            fileName: 'MedievalSharp64',
            textSet: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
            textStyle: {
                fontSize: '64px',
                fontFamily: 'MedievalSharp',
                color: '#ffffff',
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    blur: 0,
                    fill: true,
                    stroke: true,
                    color: '#000000'
                },
            }
        }
    );
    //exit node
    return process.exit(1);

})();