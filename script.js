(function () {

  const tool =
    document.getElementById(
      "displacement-tool"
    );

  const container =
    document.getElementById(
      "displacement-canvas-container"
    );

  const upload =
    document.getElementById(
      "displacement-upload"
    );


  /* EFFECTS */

  const effectSelector =
    document.getElementById(
      "effect-selector"
    );

  const displacementControls =
    document.getElementById(
      "displacement-controls"
    );

  const spikesEffectButton =
    document.getElementById(
      "effect-spikes"
    );

  const waveEffectButton =
    document.getElementById(
      "effect-wave"
    );

  const sliceEffectButton =
    document.getElementById(
      "effect-slice"
    );

  const meltEffectButton = document.getElementById("effect-melt");
  const meltPanel = document.getElementById("melt-controls-panel");
  const meltPositionSlider = document.getElementById("melt-position-slider");
  const meltRadiusSlider = document.getElementById("melt-radius-slider");
  const meltDistortionSlider = document.getElementById("melt-distortion-slider");
  const meltPositionValue = document.getElementById("melt-position-value");
  const meltRadiusValue = document.getElementById("melt-radius-value");
  const meltDistortionValue = document.getElementById("melt-distortion-value");
  const warpEffectButton = document.getElementById("effect-warp");
  const warpPanel = document.getElementById("warp-controls-panel");
  const warpDarkButton = document.getElementById("warp-mode-dark");
  const warpLightButton = document.getElementById("warp-mode-light");
  const warpDistortionSlider = document.getElementById("warp-distortion-slider");
  const warpVelocitySlider = document.getElementById("warp-velocity-slider");
  const warpDistortionValue = document.getElementById("warp-distortion-value");
  const warpVelocityValue = document.getElementById("warp-velocity-value");

  const activeEffectTitle =
    document.getElementById(
      "active-effect-title"
    );

  const spikesPanel =
    document.getElementById(
      "spikes-controls-panel"
    );

  const wavePanel =
    document.getElementById(
      "wave-controls-panel"
    );

  const slicePanel =
    document.getElementById(
      "slice-controls-panel"
    );


  /* SPIKES DOM */

  const verticalButton =
    document.getElementById(
      "direction-vertical"
    );

  const horizontalButton =
    document.getElementById(
      "direction-horizontal"
    );

  const lengthSlider =
    document.getElementById(
      "length-slider"
    );

  const densitySlider =
    document.getElementById(
      "density-slider"
    );

  const widthSlider =
    document.getElementById(
      "width-slider"
    );

  const movementSlider =
    document.getElementById(
      "movement-slider"
    );

  const lengthValue =
    document.getElementById(
      "length-value"
    );

  const densityValue =
    document.getElementById(
      "density-value"
    );

  const widthValue =
    document.getElementById(
      "width-value"
    );

  const movementValue =
    document.getElementById(
      "movement-value"
    );


  /* WAVE DOM */

  const waveXSlider =
    document.getElementById(
      "wave-x-slider"
    );

  const waveYSlider =
    document.getElementById(
      "wave-y-slider"
    );

  const waveCellSlider =
    document.getElementById(
      "wave-cell-slider"
    );

  const waveXValue =
    document.getElementById(
      "wave-x-value"
    );

  const waveYValue =
    document.getElementById(
      "wave-y-value"
    );

  const waveCellValue =
    document.getElementById(
      "wave-cell-value"
    );


  /* SLICE DOM */

  const sliceVerticalButton =
    document.getElementById(
      "slice-direction-vertical"
    );

  const sliceHorizontalButton =
    document.getElementById(
      "slice-direction-horizontal"
    );

  const sliceDisplacementSlider =
    document.getElementById(
      "slice-displacement-slider"
    );

  const sliceDensitySlider =
    document.getElementById(
      "slice-density-slider"
    );

  const sliceWidthSlider =
    document.getElementById(
      "slice-width-slider"
    );

  const sliceDisplacementValue =
    document.getElementById(
      "slice-displacement-value"
    );

  const sliceDensityValue =
    document.getElementById(
      "slice-density-value"
    );

  const sliceWidthValue =
    document.getElementById(
      "slice-width-value"
    );


  const downloadButton =
    document.getElementById(
      "download-button"
    );


  if (!tool || !container || !upload) {
    return;
  }


  /* CONTROLS WIDTH: first three effect buttons on desktop,
     full selector width on mobile. */

  function syncControlsWidth() {
    if (!effectSelector || !displacementControls) return;

    const selectorRect = effectSelector.getBoundingClientRect();
    const isMobileWidth = window.matchMedia("(max-width: 767px)").matches;
    const thirdButton = document.getElementById("effect-slice");

    let width = selectorRect.width;

    if (!isMobileWidth && thirdButton) {
      const thirdRect = thirdButton.getBoundingClientRect();
      width = thirdRect.right - selectorRect.left;
    }

    if (width > 0) {
      displacementControls.style.width = width + "px";
    }
  }


  function updateMobileLayout() {

    const isMobile =
      window.matchMedia(
        "(max-width: 767px), (hover: none) and (pointer: coarse)"
      ).matches;

    if (!isMobile) {

      tool.style.removeProperty(
        "--mobile-canvas-top"
      );

      return;
    }

    const toolRect =
      tool.getBoundingClientRect();

    const controlsRect =
      displacementControls
        .getBoundingClientRect();

    const canvasTop =
      Math.max(
        0,
        Math.ceil(
          controlsRect.bottom -
          toolRect.top +
          30
        )
      );

    tool.style.setProperty(
      "--mobile-canvas-top",
      canvasTop + "px"
    );

  }


  requestAnimationFrame(
    function () {

      syncControlsWidth();
      updateMobileLayout();

    }
  );


  if (
    document.fonts &&
    document.fonts.ready
  ) {

    document.fonts.ready.then(
      function () {

        syncControlsWidth();
        updateMobileLayout();

      }
    );

  }


  function getToolSize() {

    const rect =
      container.getBoundingClientRect();

    return {
      width:
        Math.max(
          1,
          Math.floor(rect.width)
        ),

      height:
        Math.max(
          1,
          Math.floor(rect.height)
        )
    };

  }


  function startSketch() {

    new p5(function (p) {


      /* IMAGE */

      let sourceImage = null;

      /* Screen-sized Retina cache used only for Slice preview. */
      let slicePreviewImage = null;


      /* DISPLAY */

      let displayScale = 1;

      let displayWidth = 0;
      let displayHeight = 0;

      let offsetX = 0;
      let offsetY = 0;


      /* EFFECT */

      let currentEffect =
        "spikes";


      /* SPIKES */

      let spikes = [];

      let direction =
        "vertical";

      const previewStep =
        4;

      const previewEdgeDistance =
        6;

      const edgeThreshold =
        65;

      const minSpikeLength =
        20;

      let maxSpikeLength =
        50;

      const minSpikeWidth =
        1;

      let maxSpikeWidth =
        5;

      const noiseSpeed =
        0.007;

      let spikeChance =
        0.18;

      /*
        Multiplicative noise amplitude.
        The movement UI maps 0..100 to 0.10..0.90,
        so even low values remain visibly animated.
      */
      let noiseAmount =
        0.452;


      /* WAVE */

      let waveXDistortion =
        12;

      let waveYDistortion =
        22;

      let waveCellSize =
        4;


      /* SLICE */

      let sliceDirection =
        "vertical";

      let sliceDisplacement =
        40;

      let sliceDensity =
        30;

      let sliceWidth =
        12;

      let sliceProfiles =
        [];

      const sliceProfileCount =
        100;


      /* WARP STATE */
      let warpMode = "dark areas";
      let warpDistortion = 40;
      let warpVelocity = 20;
      let warpEngine = null;
      let warpPreviewImage = null;
      let warpPreviewCanvas = null;
      let warpJobId = 0;
      let warpRenderedKey = null;
      let warpWorkingKey = null;
      let warpSourceVersion = 0;
      let warpExporting = false;

      /* MELT STATE — preview cached independently from original image */
      const MELT_MAX_PREVIEW = 900;
      const MELT_ROWS_PER_FRAME = 28;
      let meltPreview = null;
      let meltResult = null;
      let meltMapX = null;
      let meltMapY = null;
      let meltPixels = null;
      let meltDestination = null;
      let meltRenderY = 0;
      let meltJob = 0;
      let meltReadyKey = null;
      let meltPendingKey = null;
      let meltExporting = false;

      /* PERFORMANCE SCHEDULERS */

      let staticRedrawFrame = null;
      let spikeGenerationFrame = null;

      function redrawStaticEffect() {

        if (
          currentEffect !== "wave" &&
          currentEffect !== "slice"
        ) {
          return;
        }

        if (staticRedrawFrame !== null) {
          return;
        }

        staticRedrawFrame =
          requestAnimationFrame(
            function () {

              staticRedrawFrame = null;

              if (
                currentEffect === "wave" ||
                currentEffect === "slice"
              ) {
                p.redraw();
              }

            }
          );

      }


      function scheduleSpikeGeneration() {

        if (spikeGenerationFrame !== null) {
          return;
        }

        spikeGenerationFrame =
          requestAnimationFrame(
            function () {

              spikeGenerationFrame = null;
              generateSpikes();

            }
          );

      }


      /* SETUP */

      p.setup = function () {

        const size =
          getToolSize();

        p.pixelDensity(2);

        /* Performance test: cap continuously animated Spikes at 30 fps.
           Wave and Slice use noLoop()/redraw(), so their behavior is unchanged. */
        p.frameRate(30);

        const canvas =
          p.createCanvas(
            size.width,
            size.height
          );

        canvas.parent(
          container
        );

        p.background(
          "#f9f9f9"
        );

        generateSliceProfiles();

        requestAnimationFrame(
          function () {

            updateMobileLayout();
            resizeToTool();

          }
        );

      };


      /* UPLOAD */

      upload.addEventListener(
        "change",
        function (event) {

          const file =
            event.target.files &&
            event.target.files[0];

          if (!file) {
            return;
          }

          const objectURL =
            URL.createObjectURL(
              file
            );

          p.loadImage(

            objectURL,

            function (loadedImage) {

              sourceImage =
                loadedImage;

              sourceImage.loadPixels();

              prepareDisplay();
              meltPrepare();

              generateSliceProfiles();
              warpSourceVersion++;
              warpReset();

              URL.revokeObjectURL(
                objectURL
              );

              if (
                currentEffect ===
                "spikes"
              ) {

                p.loop();

              }

              else if (currentEffect === "warp") {
                warpStart();
              }
              else if (currentEffect === "melt") {
                meltStart();
              }
              else {
                p.redraw();
              }

            },

            function (error) {

              console.error(
                "Could not load image:",
                error
              );

              URL.revokeObjectURL(
                objectURL
              );

            }

          );

        }
      );


      /* DISPLAY */

      function prepareDisplay() {

        if (!sourceImage) {
          return;
        }

        displayScale =
          Math.min(
            p.width /
              sourceImage.width,

            p.height /
              sourceImage.height
          );

        // Snap the image bounds to whole canvas pixels.
        // Extend the drawn image 2px downward to cover a persistent bottom seam.
        displayWidth = Math.round(sourceImage.width * displayScale);
        displayHeight = Math.round(sourceImage.height * displayScale) + 2;

        offsetX = Math.round((p.width - displayWidth) / 2);

        const isMobile =
          window.matchMedia(
            "(max-width: 767px), (hover: none) and (pointer: coarse)"
          ).matches;

        offsetY = isMobile
          ? 0
          : Math.round((p.height - displayHeight) / 2);

        generateSpikes();
        prepareSlicePreview();

      }


      function prepareSlicePreview() {

        if (!sourceImage || displayWidth <= 0 || displayHeight <= 0) {
          slicePreviewImage = null;
          return;
        }

        /* Match the pixelDensity(2) preview, but never upscale the original. */
        const targetWidth =
          Math.max(
            1,
            Math.min(
              sourceImage.width,
              Math.ceil(displayWidth * 2)
            )
          );

        const targetHeight =
          Math.max(
            1,
            Math.min(
              sourceImage.height,
              Math.ceil(displayHeight * 2)
            )
          );

        if (
          slicePreviewImage &&
          slicePreviewImage.width === targetWidth &&
          slicePreviewImage.height === targetHeight
        ) {
          return;
        }

        const preview =
          sourceImage.get();

        preview.resize(
          targetWidth,
          targetHeight
        );

        slicePreviewImage =
          preview;

      }


      /* SOURCE PIXEL */

      function getSourcePixel(x, y) {

        x = Math.floor(
          p.constrain(
            x,
            0,
            sourceImage.width - 1
          )
        );

        y = Math.floor(
          p.constrain(
            y,
            0,
            sourceImage.height - 1
          )
        );

        const index =
          4 *
          (
            x +
            y * sourceImage.width
          );

        return {
          r: sourceImage.pixels[index],
          g: sourceImage.pixels[index + 1],
          b: sourceImage.pixels[index + 2]
        };

      }


      function colorDifference(a, b) {

        const dr = a.r - b.r;
        const dg = a.g - b.g;
        const db = a.b - b.b;

        return Math.sqrt(
          dr * dr +
          dg * dg +
          db * db
        );

      }


      /* =====================================================
         ORIGINAL SPIKES MECHANICS
         ===================================================== */

      function addSpike(
        sourceX,
        sourceY,
        sign,
        contrast
      ) {

        const contrastFactor =
          p.constrain(
            p.map(
              contrast,
              edgeThreshold,
              255,
              0,
              1
            ),
            0,
            1
          );

        let lengthFactor =
          p.random(
            0.35,
            1
          );

        lengthFactor *=
          p.map(
            contrastFactor,
            0,
            1,
            0.6,
            1.2
          );

        spikes.push({
          sourceX: sourceX,
          sourceY: sourceY,
          sign: sign,
          lengthFactor: lengthFactor,
          width: p.random(
            minSpikeWidth,
            maxSpikeWidth
          ),
          noiseOffset: p.random(1000)
        });

      }


      function generateSpikes() {

        spikes = [];

        if (
          !sourceImage ||
          displayScale <= 0
        ) {
          return;
        }

        const sourceStep =
          Math.max(
            1,
            Math.round(
              previewStep /
              displayScale
            )
          );

        const sourceEdgeDistance =
          Math.max(
            1,
            Math.round(
              previewEdgeDistance /
              displayScale
            )
          );

        const sourceSkip =
          Math.max(
            1,
            Math.round(
              8 /
              displayScale
            )
          );


        /* ---------------------------------------------------
           VERTICAL
           Compare above / below exactly like the old sketch.
           --------------------------------------------------- */

        if (direction === "vertical") {

          for (
            let x = 0;
            x < sourceImage.width;
            x += sourceStep
          ) {

            for (
              let y = sourceEdgeDistance;
              y <
                sourceImage.height -
                sourceEdgeDistance;
              y += sourceStep
            ) {

              const currentColor =
                getSourcePixel(x, y);

              const colorAbove =
                getSourcePixel(
                  x,
                  y - sourceEdgeDistance
                );

              const colorBelow =
                getSourcePixel(
                  x,
                  y + sourceEdgeDistance
                );

              const contrastAbove =
                colorDifference(
                  currentColor,
                  colorAbove
                );

              const contrastBelow =
                colorDifference(
                  currentColor,
                  colorBelow
                );

              if (
                contrastAbove > edgeThreshold &&
                contrastAbove > contrastBelow &&
                p.random() < spikeChance
              ) {

                addSpike(
                  x,
                  y,
                  -1,
                  contrastAbove
                );

                y += sourceSkip;

              }

              else if (
                contrastBelow > edgeThreshold &&
                contrastBelow > contrastAbove &&
                p.random() < spikeChance
              ) {

                addSpike(
                  x,
                  y,
                  1,
                  contrastBelow
                );

                y += sourceSkip;

              }

            }

          }

        }


        /* ---------------------------------------------------
           HORIZONTAL
           Same logic rotated 90 degrees: left / right.
           --------------------------------------------------- */

        else {

          for (
            let y = 0;
            y < sourceImage.height;
            y += sourceStep
          ) {

            for (
              let x = sourceEdgeDistance;
              x <
                sourceImage.width -
                sourceEdgeDistance;
              x += sourceStep
            ) {

              const currentColor =
                getSourcePixel(x, y);

              const colorLeft =
                getSourcePixel(
                  x - sourceEdgeDistance,
                  y
                );

              const colorRight =
                getSourcePixel(
                  x + sourceEdgeDistance,
                  y
                );

              const contrastLeft =
                colorDifference(
                  currentColor,
                  colorLeft
                );

              const contrastRight =
                colorDifference(
                  currentColor,
                  colorRight
                );

              if (
                contrastLeft > edgeThreshold &&
                contrastLeft > contrastRight &&
                p.random() < spikeChance
              ) {

                addSpike(
                  x,
                  y,
                  -1,
                  contrastLeft
                );

                x += sourceSkip;

              }

              else if (
                contrastRight > edgeThreshold &&
                contrastRight > contrastLeft &&
                p.random() < spikeChance
              ) {

                addSpike(
                  x,
                  y,
                  1,
                  contrastRight
                );

                x += sourceSkip;

              }

            }

          }

        }

      }


      /* SPIKES DRAWING */

      function getSpikeLength(spike) {

        const baseLength =
          maxSpikeLength *
          spike.lengthFactor;

        const noiseValue =
          p.noise(
            spike.noiseOffset +
            p.frameCount * noiseSpeed * 2
          );

        const noiseFactor =
          p.map(
            noiseValue,
            0,
            1,
            1 - noiseAmount,
            1 + noiseAmount
          );

        return Math.max(
          1,
          baseLength * noiseFactor
        );

      }


      function drawVerticalSpike(
        spike,
        screenX,
        screenY,
        spikeLength
      ) {

        const halfWidth =
          spike.width / 2;

        const tipY =
          screenY +
          spikeLength *
          spike.sign;

        const sourceWidth =
          Math.max(
            1,
            Math.floor(
              spike.width /
              displayScale
            )
          );

        const sourceHeight =
          Math.max(
            1,
            Math.round(
              2 /
              displayScale
            )
          );

        const sourceX =
          p.constrain(
            Math.floor(
              spike.sourceX -
              sourceWidth / 2
            ),
            0,
            Math.max(
              0,
              sourceImage.width -
              sourceWidth
            )
          );

        const sourceY =
          p.constrain(
            Math.floor(
              spike.sourceY
            ),
            0,
            Math.max(
              0,
              sourceImage.height -
              sourceHeight
            )
          );

        const ctx =
          p.drawingContext;

        ctx.save();
        ctx.beginPath();

        ctx.moveTo(
          screenX - halfWidth,
          screenY
        );

        ctx.lineTo(
          screenX + halfWidth,
          screenY
        );

        ctx.lineTo(
          screenX,
          tipY
        );

        ctx.closePath();
        ctx.clip();

        if (spike.sign < 0) {

          p.image(
            sourceImage,
            screenX - halfWidth,
            tipY,
            spike.width,
            spikeLength,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
          );

        }

        else {

          p.image(
            sourceImage,
            screenX - halfWidth,
            screenY,
            spike.width,
            spikeLength,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
          );

        }

        ctx.restore();

      }


      function drawHorizontalSpike(
        spike,
        screenX,
        screenY,
        spikeLength
      ) {

        const halfWidth =
          spike.width / 2;

        const tipX =
          screenX +
          spikeLength *
          spike.sign;

        const sourceWidth =
          Math.max(
            1,
            Math.round(
              2 /
              displayScale
            )
          );

        const sourceHeight =
          Math.max(
            1,
            Math.floor(
              spike.width /
              displayScale
            )
          );

        const sourceX =
          p.constrain(
            Math.floor(
              spike.sourceX
            ),
            0,
            Math.max(
              0,
              sourceImage.width -
              sourceWidth
            )
          );

        const sourceY =
          p.constrain(
            Math.floor(
              spike.sourceY -
              sourceHeight / 2
            ),
            0,
            Math.max(
              0,
              sourceImage.height -
              sourceHeight
            )
          );

        const ctx =
          p.drawingContext;

        ctx.save();
        ctx.beginPath();

        ctx.moveTo(
          screenX,
          screenY - halfWidth
        );

        ctx.lineTo(
          screenX,
          screenY + halfWidth
        );

        ctx.lineTo(
          tipX,
          screenY
        );

        ctx.closePath();
        ctx.clip();

        if (spike.sign < 0) {

          p.image(
            sourceImage,
            tipX,
            screenY - halfWidth,
            spikeLength,
            spike.width,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
          );

        }

        else {

          p.image(
            sourceImage,
            screenX,
            screenY - halfWidth,
            spikeLength,
            spike.width,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
          );

        }

        ctx.restore();

      }


      function drawSpikes() {

        p.image(
          sourceImage,
          offsetX,
          offsetY,
          displayWidth,
          displayHeight
        );

        for (
          let i = 0;
          i < spikes.length;
          i++
        ) {

          const spike =
            spikes[i];

          const spikeLength =
            getSpikeLength(spike);

          const screenX =
            offsetX +
            spike.sourceX *
            displayScale;

          const screenY =
            offsetY +
            spike.sourceY *
            displayScale;

          if (direction === "vertical") {

            drawVerticalSpike(
              spike,
              screenX,
              screenY,
              spikeLength
            );

          }

          else {

            drawHorizontalSpike(
              spike,
              screenX,
              screenY,
              spikeLength
            );

          }

        }

      }


      /* WAVE */

      function drawWave() {

        let cellSize =
          waveCellSize;

        let cols =
          Math.ceil(
            displayWidth /
            cellSize
          );

        let rows =
          Math.ceil(
            displayHeight /
            cellSize
          );

        const maxCells =
          32000;

        const totalCells =
          cols * rows;

        if (
          totalCells >
          maxCells
        ) {

          const multiplier =
            Math.sqrt(
              totalCells /
              maxCells
            );

          cellSize *=
            multiplier;

          cols =
            Math.ceil(
              displayWidth /
              cellSize
            );

          rows =
            Math.ceil(
              displayHeight /
              cellSize
            );

        }

        const rowXWave =
          new Array(rows);

        const rowXDetail =
          new Array(rows);

        const rowYDetail =
          new Array(rows);

        for (
          let j = 0;
          j < rows;
          j++
        ) {

          rowXWave[j] =
            Math.sin(
              j * 0.10
            );

          rowXDetail[j] =
            Math.sin(
              j * 0.47
            ) * 0.3;

          rowYDetail[j] =
            Math.sin(
              j * 0.37
            ) * 0.45;

        }

        for (
          let j = 0;
          j < rows;
          j++
        ) {

          const destinationY =
            j * cellSize;

          const xWave =
            rowXWave[j] +
            rowXDetail[j];

          const xShift =
            Math.floor(
              xWave *
              waveXDistortion
            );

          for (
            let i = 0;
            i < cols;
            i++
          ) {

            const destinationX =
              i * cellSize;

            const yWave =
              Math.sin(
                j * 0.08 +
                i * 0.015
              );

            const yShift =
              Math.floor(
                (
                  yWave +
                  rowYDetail[j]
                ) *
                waveYDistortion
              );

            let displacedX =
              Math.floor(
                (
                  destinationX +
                  xShift
                ) /
                cellSize
              ) *
              cellSize;

            let displacedY =
              Math.floor(
                (
                  destinationY +
                  yShift
                ) /
                cellSize
              ) *
              cellSize;

            displacedX =
              (
                (
                  displacedX %
                  displayWidth
                ) +
                displayWidth
              ) %
              displayWidth;

            displacedY =
              (
                (
                  displacedY %
                  displayHeight
                ) +
                displayHeight
              ) %
              displayHeight;

            const sourceX =
              displacedX /
              displayScale;

            const sourceY =
              displacedY /
              displayScale;

            const sourceCellWidth =
              Math.min(
                cellSize /
                displayScale,

                sourceImage.width -
                sourceX
              );

            const sourceCellHeight =
              Math.min(
                cellSize /
                displayScale,

                sourceImage.height -
                sourceY
              );

            const destinationWidth =
              Math.min(
                cellSize,

                displayWidth -
                destinationX
              );

            const destinationHeight =
              Math.min(
                cellSize,

                displayHeight -
                destinationY
              );

            if (
              sourceCellWidth <= 0 ||
              sourceCellHeight <= 0 ||
              destinationWidth <= 0 ||
              destinationHeight <= 0
            ) {
              continue;
            }

            p.image(
              sourceImage,

              offsetX +
                destinationX,

              offsetY +
                destinationY,

              destinationWidth,
              destinationHeight,

              sourceX,
              sourceY,

              sourceCellWidth,
              sourceCellHeight
            );

          }

        }

      }


      /* SLICE */

      function generateSliceProfiles() {

        sliceProfiles = [];

        for (
          let i = 0;
          i < sliceProfileCount;
          i++
        ) {

          sliceProfiles.push({
            position:
              p.random(),

            widthFactor:
              p.random(
                0.45,
                1.35
              ),

            strength:
              p.random(
                0.25,
                1
              ),

            phase:
              p.random(
                0,
                p.TWO_PI
              )
          });

        }

      }


      function getSliceAmount(
        profile,
        pass,
        passes,
        scale
      ) {

        const passProgress =
          pass /
          passes;

        const variation =
          0.65 +
          0.35 *
          Math.sin(
            profile.phase +
            pass * 0.9
          );

        return (
          sliceDisplacement *
          profile.strength *
          variation *
          passProgress *
          scale
        );

      }


      function drawSlice() {

        const previewSource =
          slicePreviewImage ||
          sourceImage;

        const previewScaleX =
          previewSource.width /
          displayWidth;

        const previewScaleY =
          previewSource.height /
          displayHeight;

        p.image(
          previewSource,

          offsetX,
          offsetY,

          displayWidth,
          displayHeight
        );

        if (
          sliceDisplacement === 0
        ) {
          return;
        }

        const activeCount =
          Math.max(
            1,
            Math.round(
              sliceProfiles.length *
              (
                sliceDensity /
                100
              )
            )
          );

        const displacementNormalized =
          Math.min(
            1,
            Math.abs(
              sliceDisplacement
            ) / 100
          );

        const passes =
          Math.max(
            1,
            Math.round(
              1 +
              displacementNormalized *
              7
            )
          );

        for (
          let pass = 1;
          pass <= passes;
          pass++
        ) {

          for (
            let i = 0;
            i < activeCount;
            i++
          ) {

            const profile =
              sliceProfiles[i];

            const thickness =
              Math.max(
                1,
                sliceWidth *
                profile.widthFactor
              );

            const amount =
              getSliceAmount(
                profile,
                pass,
                passes,
                1
              );

            if (
              sliceDirection ===
              "vertical"
            ) {

              const destinationX =
                profile.position *
                displayWidth;

              const sourceX =
                Math.max(
                  0,
                  Math.min(
                    previewSource.width -
                    1,

                    destinationX *
                    previewScaleX
                  )
                );

              const sourceWidth =
                Math.max(
                  1,
                  Math.min(
                    thickness *
                    previewScaleX,

                    previewSource.width -
                    sourceX
                  )
                );

              const destinationWidth =
                Math.min(
                  thickness,

                  displayWidth -
                  destinationX
                );

              if (
                destinationWidth <= 0
              ) {
                continue;
              }

              p.image(
                previewSource,

                offsetX +
                  destinationX,

                offsetY +
                  amount,

                destinationWidth,
                displayHeight,

                sourceX,
                0,

                sourceWidth,
                previewSource.height
              );

            }

            else {

              const destinationY =
                profile.position *
                displayHeight;

              const sourceY =
                Math.max(
                  0,
                  Math.min(
                    previewSource.height -
                    1,

                    destinationY *
                    previewScaleY
                  )
                );

              const sourceHeight =
                Math.max(
                  1,
                  Math.min(
                    thickness *
                    previewScaleY,

                    previewSource.height -
                    sourceY
                  )
                );

              const destinationHeight =
                Math.min(
                  thickness,

                  displayHeight -
                  destinationY
                );

              if (
                destinationHeight <= 0
              ) {
                continue;
              }

              p.image(
                previewSource,

                offsetX +
                  amount,

                offsetY +
                  destinationY,

                displayWidth,
                destinationHeight,

                0,
                sourceY,

                previewSource.width,
                sourceHeight
              );

            }

          }

        }

      }


      /* DRAW */

      p.draw = function () {

        p.background(
          "#f9f9f9"
        );

        if (!sourceImage) {
          return;
        }

        if (
          currentEffect ===
          "spikes"
        ) {

          drawSpikes();

        }

        else if (
          currentEffect ===
          "wave"
        ) {

          drawWave();

        }

        else if (currentEffect === "slice") {
          drawSlice();
        }
        else if (currentEffect === "warp") {
          drawWarp();
        }
        else if (currentEffect === "melt") {
          drawMelt();
        }

      };


      /* EFFECT SWITCHING */

      function setEffect(effect) {

        currentEffect =
          effect;

        spikesEffectButton
          .classList
          .toggle(
            "active",
            effect === "spikes"
          );

        waveEffectButton
          .classList
          .toggle(
            "active",
            effect === "wave"
          );

        warpEffectButton.classList.toggle("active", effect === "warp");
        meltEffectButton.classList.toggle("active", effect === "melt");

        sliceEffectButton
          .classList
          .toggle(
            "active",
            effect === "slice"
          );

        spikesPanel.style.display =
          effect === "spikes"
            ? "block"
            : "none";

        wavePanel.style.display =
          effect === "wave"
            ? "block"
            : "none";

        slicePanel.style.display =
          effect === "slice"
            ? "block"
            : "none";

        warpPanel.style.display = effect === "warp" ? "block" : "none";
        meltPanel.style.display = effect === "melt" ? "block" : "none";
        if (effect !== "melt") { meltJob++; meltPendingKey = null; }
        if (effect !== "warp") {
          warpJobId++;
          warpWorkingKey = null; // cancelled work must not block the next Warp activation
        }

        if (
          effect === "spikes"
        ) {

          activeEffectTitle.textContent =
            "spikes";

          p.loop();

        }

        else if (
          effect === "wave"
        ) {

          activeEffectTitle.textContent =
            "wave";

          p.noLoop();
          p.redraw();

        }

        else if (effect === "slice") {
          activeEffectTitle.textContent = "slice";
          p.noLoop();
          p.redraw();
        }
        else if (effect === "warp") {
          activeEffectTitle.textContent = "warp";
          p.noLoop();
          warpStart();
        }
        else if (effect === "melt") {
          activeEffectTitle.textContent = "melt";
          p.noLoop();
          meltStart();
        }

        requestAnimationFrame(
          function () {

            updateMobileLayout();
            resizeToTool();

          }
        );

      }


      spikesEffectButton.addEventListener(
        "click",
        function () {
          setEffect(
            "spikes"
          );
        }
      );


      waveEffectButton.addEventListener(
        "click",
        function () {
          setEffect(
            "wave"
          );
        }
      );


      sliceEffectButton.addEventListener(
        "click",
        function () {
          setEffect(
            "slice"
          );
        }
      );


      warpEffectButton.addEventListener("click", function () { setEffect("warp"); });
      meltEffectButton.addEventListener("click", function () { setEffect("melt"); });
      [[meltPositionSlider, meltPositionValue], [meltRadiusSlider, meltRadiusValue],
       [meltDistortionSlider, meltDistortionValue]].forEach(function (pair) {
        pair[0].addEventListener("input", function () { pair[1].textContent = pair[0].value; });
        pair[0].addEventListener("change", meltStart);
      });
      warpDarkButton.addEventListener("click", function () { warpSetMode("dark areas"); });
      warpLightButton.addEventListener("click", function () { warpSetMode("light areas"); });
      warpDistortionSlider.addEventListener("input", function () {
        warpDistortion = Number(warpDistortionSlider.value);
        warpDistortionValue.textContent = warpDistortion;
      });
      warpVelocitySlider.addEventListener("input", function () {
        warpVelocity = Number(warpVelocitySlider.value);
        warpVelocityValue.textContent = warpVelocity;
      });
      warpDistortionSlider.addEventListener("change", warpStart);
      warpVelocitySlider.addEventListener("change", warpStart);

      /* SPIKES CONTROLS */

      verticalButton.addEventListener(
        "click",
        function () {

          direction =
            "vertical";

          verticalButton
            .classList
            .add("active");

          horizontalButton
            .classList
            .remove("active");

          generateSpikes();

        }
      );


      horizontalButton.addEventListener(
        "click",
        function () {

          direction =
            "horizontal";

          horizontalButton
            .classList
            .add("active");

          verticalButton
            .classList
            .remove("active");

          generateSpikes();

        }
      );


      /*
        Length now behaves like mouseX
        in the original sketch:
        it changes the same spikes instead
        of generating a new composition.
      */

      lengthSlider.addEventListener(
        "input",
        function () {

          maxSpikeLength =
            Number(
              lengthSlider.value
            );

          lengthValue.textContent =
            maxSpikeLength;

        }
      );


      densitySlider.addEventListener(
        "input",
        function () {

          const value =
            Number(
              densitySlider.value
            );

          densityValue.textContent =
            value;

          spikeChance =
            value / 100;

          scheduleSpikeGeneration();

        }
      );


      widthSlider.addEventListener(
        "input",
        function () {

          maxSpikeWidth =
            Number(
              widthSlider.value
            );

          widthValue.textContent =
            maxSpikeWidth;

          scheduleSpikeGeneration();

        }
      );


      movementSlider.addEventListener(
        "input",
        function () {

          const value =
            Number(
              movementSlider.value
            );

          movementValue.textContent =
            value;

          /*
            Keep movement visible even at low slider values.
            UI 0..100 maps to noiseAmount 0.10..0.90.
            At 10 the amplitude is already clearly visible,
            while the upper range still has room for stronger motion.
          */
          noiseAmount =
            0.10 +
            (value / 100) * 0.80;

        }
      );


      /* WAVE CONTROLS */

      waveXSlider.addEventListener(
        "input",
        function () {

          waveXDistortion =
            Number(
              waveXSlider.value
            );

          waveXValue.textContent =
            waveXDistortion;

          redrawStaticEffect();

        }
      );


      waveYSlider.addEventListener(
        "input",
        function () {

          waveYDistortion =
            Number(
              waveYSlider.value
            );

          waveYValue.textContent =
            waveYDistortion;

          redrawStaticEffect();

        }
      );


      waveCellSlider.addEventListener(
        "input",
        function () {

          waveCellSize =
            Number(
              waveCellSlider.value
            );

          waveCellValue.textContent =
            waveCellSize;

          redrawStaticEffect();

        }
      );


      /* SLICE CONTROLS */

      sliceVerticalButton.addEventListener(
        "click",
        function () {

          sliceDirection =
            "vertical";

          sliceVerticalButton
            .classList
            .add("active");

          sliceHorizontalButton
            .classList
            .remove("active");

          redrawStaticEffect();

        }
      );


      sliceHorizontalButton.addEventListener(
        "click",
        function () {

          sliceDirection =
            "horizontal";

          sliceHorizontalButton
            .classList
            .add("active");

          sliceVerticalButton
            .classList
            .remove("active");

          redrawStaticEffect();

        }
      );


      sliceDisplacementSlider.addEventListener(
        "input",
        function () {

          sliceDisplacement =
            Number(
              sliceDisplacementSlider.value
            );

          sliceDisplacementValue.textContent =
            sliceDisplacement;

          redrawStaticEffect();

        }
      );


      sliceDensitySlider.addEventListener(
        "input",
        function () {

          sliceDensity =
            Number(
              sliceDensitySlider.value
            );

          sliceDensityValue.textContent =
            sliceDensity;

          redrawStaticEffect();

        }
      );


      sliceWidthSlider.addEventListener(
        "input",
        function () {

          sliceWidth =
            Number(
              sliceWidthSlider.value
            );

          sliceWidthValue.textContent =
            sliceWidth;

          redrawStaticEffect();

        }
      );


      /* DOWNLOAD */

      downloadButton.addEventListener(
        "click",
        function () {

          if (!sourceImage) {
            return;
          }

          if (
            currentEffect ===
            "spikes"
          ) {

            exportSpikes();

          }

          else if (
            currentEffect ===
            "wave"
          ) {

            exportWave();

          }

          else if (currentEffect === "slice") {
            exportSlice();
          }
          else if (currentEffect === "warp") {
            exportWarp();
          }
          else if (currentEffect === "melt") {
            exportMelt();
          }

        }
      );


      /* EXPORT SPIKES */

      function exportSpikes() {

        const exportGraphics =
          p.createGraphics(
            sourceImage.width,
            sourceImage.height
          );

        exportGraphics.pixelDensity(1);

        exportGraphics.image(
          sourceImage,
          0,
          0,
          sourceImage.width,
          sourceImage.height
        );

        const exportScale =
          1 / displayScale;

        for (
          let i = 0;
          i < spikes.length;
          i++
        ) {

          const spike =
            spikes[i];

          const previewLength =
            getSpikeLength(spike);

          const exportLength =
            previewLength *
            exportScale;

          const exportWidth =
            Math.max(
              1,
              spike.width *
              exportScale
            );

          const ctx =
            exportGraphics.drawingContext;


          if (direction === "vertical") {

            const halfWidth =
              exportWidth / 2;

            const baseX =
              spike.sourceX;

            const baseY =
              spike.sourceY;

            const tipY =
              baseY +
              exportLength *
              spike.sign;

            const sampleWidth =
              Math.max(
                1,
                Math.floor(
                  exportWidth
                )
              );

            const sampleHeight =
              Math.max(
                1,
                Math.round(
                  2 * exportScale
                )
              );

            const sx =
              p.constrain(
                Math.floor(
                  spike.sourceX -
                  sampleWidth / 2
                ),
                0,
                Math.max(
                  0,
                  sourceImage.width -
                  sampleWidth
                )
              );

            const sy =
              p.constrain(
                Math.floor(
                  spike.sourceY
                ),
                0,
                Math.max(
                  0,
                  sourceImage.height -
                  sampleHeight
                )
              );

            ctx.save();
            ctx.beginPath();

            ctx.moveTo(
              baseX - halfWidth,
              baseY
            );

            ctx.lineTo(
              baseX + halfWidth,
              baseY
            );

            ctx.lineTo(
              baseX,
              tipY
            );

            ctx.closePath();
            ctx.clip();

            if (spike.sign < 0) {

              exportGraphics.image(
                sourceImage,
                baseX - halfWidth,
                tipY,
                exportWidth,
                exportLength,
                sx,
                sy,
                sampleWidth,
                sampleHeight
              );

            }

            else {

              exportGraphics.image(
                sourceImage,
                baseX - halfWidth,
                baseY,
                exportWidth,
                exportLength,
                sx,
                sy,
                sampleWidth,
                sampleHeight
              );

            }

            ctx.restore();

          }


          else {

            const halfWidth =
              exportWidth / 2;

            const baseX =
              spike.sourceX;

            const baseY =
              spike.sourceY;

            const tipX =
              baseX +
              exportLength *
              spike.sign;

            const sampleWidth =
              Math.max(
                1,
                Math.round(
                  2 * exportScale
                )
              );

            const sampleHeight =
              Math.max(
                1,
                Math.floor(
                  exportWidth
                )
              );

            const sx =
              p.constrain(
                Math.floor(
                  spike.sourceX
                ),
                0,
                Math.max(
                  0,
                  sourceImage.width -
                  sampleWidth
                )
              );

            const sy =
              p.constrain(
                Math.floor(
                  spike.sourceY -
                  sampleHeight / 2
                ),
                0,
                Math.max(
                  0,
                  sourceImage.height -
                  sampleHeight
                )
              );

            ctx.save();
            ctx.beginPath();

            ctx.moveTo(
              baseX,
              baseY - halfWidth
            );

            ctx.lineTo(
              baseX,
              baseY + halfWidth
            );

            ctx.lineTo(
              tipX,
              baseY
            );

            ctx.closePath();
            ctx.clip();

            if (spike.sign < 0) {

              exportGraphics.image(
                sourceImage,
                tipX,
                baseY - halfWidth,
                exportLength,
                exportWidth,
                sx,
                sy,
                sampleWidth,
                sampleHeight
              );

            }

            else {

              exportGraphics.image(
                sourceImage,
                baseX,
                baseY - halfWidth,
                exportLength,
                exportWidth,
                sx,
                sy,
                sampleWidth,
                sampleHeight
              );

            }

            ctx.restore();

          }

        }

        p.save(
          exportGraphics,
          "spikes.png"
        );

        exportGraphics.remove();

      }


      /* EXPORT WAVE */

      function exportWave() {

        const exportGraphics =
          p.createGraphics(
            sourceImage.width,
            sourceImage.height
          );

        exportGraphics.pixelDensity(1);

        const scale =
          1 /
          displayScale;

        let cellSize =
          waveCellSize *
          scale;

        let cols =
          Math.ceil(
            sourceImage.width /
            cellSize
          );

        let rows =
          Math.ceil(
            sourceImage.height /
            cellSize
          );

        const maxCells =
          32000;

        const totalCells =
          cols * rows;

        if (
          totalCells >
          maxCells
        ) {

          const multiplier =
            Math.sqrt(
              totalCells /
              maxCells
            );

          cellSize *=
            multiplier;

          cols =
            Math.ceil(
              sourceImage.width /
              cellSize
            );

          rows =
            Math.ceil(
              sourceImage.height /
              cellSize
            );

        }

        const xDistortion =
          waveXDistortion *
          scale;

        const yDistortion =
          waveYDistortion *
          scale;

        const rowXWave =
          new Array(rows);

        const rowXDetail =
          new Array(rows);

        const rowYDetail =
          new Array(rows);

        for (
          let j = 0;
          j < rows;
          j++
        ) {

          rowXWave[j] =
            Math.sin(
              j * 0.10
            );

          rowXDetail[j] =
            Math.sin(
              j * 0.47
            ) * 0.3;

          rowYDetail[j] =
            Math.sin(
              j * 0.37
            ) * 0.45;

        }

        for (
          let j = 0;
          j < rows;
          j++
        ) {

          const destinationY =
            j *
            cellSize;

          const xWave =
            rowXWave[j] +
            rowXDetail[j];

          const xShift =
            Math.floor(
              xWave *
              xDistortion
            );

          for (
            let i = 0;
            i < cols;
            i++
          ) {

            const destinationX =
              i *
              cellSize;

            const yWave =
              Math.sin(
                j * 0.08 +
                i * 0.015
              );

            const yShift =
              Math.floor(
                (
                  yWave +
                  rowYDetail[j]
                ) *
                yDistortion
              );

            let displacedX =
              Math.floor(
                (
                  destinationX +
                  xShift
                ) /
                cellSize
              ) *
              cellSize;

            let displacedY =
              Math.floor(
                (
                  destinationY +
                  yShift
                ) /
                cellSize
              ) *
              cellSize;

            displacedX =
              (
                (
                  displacedX %
                  sourceImage.width
                ) +
                sourceImage.width
              ) %
              sourceImage.width;

            displacedY =
              (
                (
                  displacedY %
                  sourceImage.height
                ) +
                sourceImage.height
              ) %
              sourceImage.height;

            const sourceWidth =
              Math.min(
                cellSize,

                sourceImage.width -
                displacedX
              );

            const sourceHeight =
              Math.min(
                cellSize,

                sourceImage.height -
                displacedY
              );

            const destinationWidth =
              Math.min(
                cellSize,

                sourceImage.width -
                destinationX
              );

            const destinationHeight =
              Math.min(
                cellSize,

                sourceImage.height -
                destinationY
              );

            if (
              sourceWidth <= 0 ||
              sourceHeight <= 0 ||
              destinationWidth <= 0 ||
              destinationHeight <= 0
            ) {
              continue;
            }

            exportGraphics.image(
              sourceImage,

              destinationX,
              destinationY,

              destinationWidth,
              destinationHeight,

              displacedX,
              displacedY,

              sourceWidth,
              sourceHeight
            );

          }

        }

        p.save(
          exportGraphics,
          "wave.png"
        );

        exportGraphics.remove();

      }


      /* EXPORT SLICE */

      function exportSlice() {

        const exportScale =
          1 /
          displayScale;


        if (
          sliceDisplacement === 0
        ) {

          const cleanExport =
            p.createGraphics(
              sourceImage.width,
              sourceImage.height
            );

          cleanExport.pixelDensity(1);

          cleanExport.background(
            "#f9f9f9"
          );

          cleanExport.image(
            sourceImage,

            0,
            0,

            sourceImage.width,
            sourceImage.height
          );

          p.save(
            cleanExport,
            "slice.png"
          );

          cleanExport.remove();

          return;

        }


        const activeCount =
          Math.max(
            1,
            Math.round(
              sliceProfiles.length *
              (
                sliceDensity /
                100
              )
            )
          );


        const displacementNormalized =
          Math.min(
            1,
            Math.abs(
              sliceDisplacement
            ) / 100
          );


        const passes =
          Math.max(
            1,
            Math.round(
              1 +
              displacementNormalized *
              7
            )
          );


        let minX = 0;
        let minY = 0;

        let maxX =
          sourceImage.width;

        let maxY =
          sourceImage.height;


        for (
          let pass = 1;
          pass <= passes;
          pass++
        ) {

          for (
            let i = 0;
            i < activeCount;
            i++
          ) {

            const profile =
              sliceProfiles[i];

            const amount =
              getSliceAmount(
                profile,
                pass,
                passes,
                exportScale
              );

            if (
              sliceDirection ===
              "vertical"
            ) {

              minY =
                Math.min(
                  minY,
                  amount
                );

              maxY =
                Math.max(
                  maxY,
                  amount +
                  sourceImage.height
                );

            }

            else {

              minX =
                Math.min(
                  minX,
                  amount
                );

              maxX =
                Math.max(
                  maxX,
                  amount +
                  sourceImage.width
                );

            }

          }

        }


        minX =
          Math.floor(minX);

        minY =
          Math.floor(minY);

        maxX =
          Math.ceil(maxX);

        maxY =
          Math.ceil(maxY);


        const exportWidth =
          Math.max(
            1,
            maxX - minX
          );

        const exportHeight =
          Math.max(
            1,
            maxY - minY
          );


        const originX =
          -minX;

        const originY =
          -minY;


        const exportGraphics =
          p.createGraphics(
            exportWidth,
            exportHeight
          );

        exportGraphics.pixelDensity(1);

        exportGraphics.background(
          "#f9f9f9"
        );


        exportGraphics.image(
          sourceImage,

          originX,
          originY,

          sourceImage.width,
          sourceImage.height
        );


        for (
          let pass = 1;
          pass <= passes;
          pass++
        ) {

          for (
            let i = 0;
            i < activeCount;
            i++
          ) {

            const profile =
              sliceProfiles[i];

            const thickness =
              Math.max(
                1,
                sliceWidth *
                profile.widthFactor *
                exportScale
              );

            const amount =
              getSliceAmount(
                profile,
                pass,
                passes,
                exportScale
              );


            if (
              sliceDirection ===
              "vertical"
            ) {

              const sourceX =
                profile.position *
                sourceImage.width;

              const sourceWidth =
                Math.min(
                  thickness,

                  sourceImage.width -
                  sourceX
                );

              if (
                sourceWidth <= 0
              ) {
                continue;
              }

              exportGraphics.image(
                sourceImage,

                originX +
                  sourceX,

                originY +
                  amount,

                sourceWidth,
                sourceImage.height,

                sourceX,
                0,

                sourceWidth,
                sourceImage.height
              );

            }


            else {

              const sourceY =
                profile.position *
                sourceImage.height;

              const sourceHeight =
                Math.min(
                  thickness,

                  sourceImage.height -
                  sourceY
                );

              if (
                sourceHeight <= 0
              ) {
                continue;
              }

              exportGraphics.image(
                sourceImage,

                originX +
                  amount,

                originY +
                  sourceY,

                sourceImage.width,
                sourceHeight,

                0,
                sourceY,

                sourceImage.width,
                sourceHeight
              );

            }

          }

        }


        p.save(
          exportGraphics,
          "slice.png"
        );

        exportGraphics.remove();

      }



      /* =====================================================
         WARP 1.2 — integrated, cached coordinate advection
         The other effects and their export paths are unchanged.
         ===================================================== */

      const WARP_GRID_MAX = 180;
      const WARP_PREVIEW_MAX = 700;
      const WARP_BRIGHTNESS_LIMIT = 100;

      function warpClamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
      }

      function warpSetMode(mode) {
        warpMode = mode;
        warpDarkButton.classList.toggle("active", mode === "dark areas");
        warpLightButton.classList.toggle("active", mode === "light areas");
        warpStart();
      }

      function warpReset() {
        warpJobId++;
        warpEngine = null;
        warpPreviewImage = null;
        warpPreviewCanvas = null;
        warpRenderedKey = null;
        warpWorkingKey = null;
      }

      function warpMakeEngine() {
        if (!sourceImage) return null;
        const factor = Math.min(1, WARP_PREVIEW_MAX / Math.max(sourceImage.width, sourceImage.height));
        const w = Math.max(1, Math.round(sourceImage.width * factor));
        const h = Math.max(1, Math.round(sourceImage.height * factor));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", {willReadFrequently:true});
        ctx.drawImage(sourceImage.canvas, 0, 0, w, h);
        const pixels = ctx.getImageData(0, 0, w, h).data;
        const gridFactor = WARP_GRID_MAX / Math.max(w,h);
        const gw = Math.max(8, Math.round(w * gridFactor));
        const gh = Math.max(8, Math.round(h * gridFactor));
        const n = gw * gh;
        const brightness = new Float32Array(n);
        const baseX = new Float32Array(n), baseY = new Float32Array(n);
        const mapX = new Float32Array(n), mapY = new Float32Array(n);
        const nextX = new Float32Array(n), nextY = new Float32Array(n);
        const vx = new Float32Array(n), vy = new Float32Array(n);
        const influence = new Float32Array(n);
        const a = new Int32Array(n), b = new Int32Array(n);
        const c = new Int32Array(n), d = new Int32Array(n);
        const wa = new Float32Array(n), wb = new Float32Array(n);
        const wc = new Float32Array(n), wd = new Float32Array(n);
        for (let y=0;y<gh;y++) for (let x=0;x<gw;x++) {
          const i=y*gw+x;
          const sx=Math.min(w-1,Math.floor((x+.5)*w/gw));
          const sy=Math.min(h-1,Math.floor((y+.5)*h/gh));
          const k=(sy*w+sx)*4;
          brightness[i]=pixels[k]*.2126+pixels[k+1]*.7152+pixels[k+2]*.0722;
          baseX[i]=x; baseY[i]=y;
        }
        return {w,h,gw,gh,n,pixels,brightness,baseX,baseY,mapX,mapY,nextX,nextY,vx,vy,influence,a,b,c,d,wa,wb,wc,wd,mode:null,velocity:null,lookupKey:null,canvas,ctx};
      }

      function warpBuildMask(e, mode) {
        if (e.mode === mode) return;
        const {gw,gh,n,brightness,influence}=e;
        const base=new Float32Array(n);
        for (let i=0;i<n;i++) {
          base[i]=mode==="dark areas"
            ? warpClamp((WARP_BRIGHTNESS_LIMIT+35-brightness[i])/65,0,1)
            : warpClamp((brightness[i]-(WARP_BRIGHTNESS_LIMIT-35))/65,0,1);
        }
        const neighbors=[];
        for(let oy=-3;oy<=3;oy++) for(let ox=-3;ox<=3;ox++) {
          const weight=Math.max(0,1-Math.sqrt(ox*ox+oy*oy)/4.5);
          if(weight>0)neighbors.push([ox,oy,weight]);
        }
        for(let y=0;y<gh;y++)for(let x=0;x<gw;x++) {
          const i=y*gw+x;let strongest=base[i];
          for(let j=0;j<neighbors.length;j++) {
            const [ox,oy,weight]=neighbors[j],xx=x+ox,yy=y+oy;
            if(xx<0||xx>=gw||yy<0||yy>=gh)continue;
            const v=base[yy*gw+xx]*weight;
            if(v>strongest)strongest=v;
          }
          influence[i]=strongest;
        }
        e.mode=mode;e.velocity=null;e.lookupKey=null;
      }

      function warpBuildVelocity(e, velocity) {
        if(e.velocity===velocity)return;
        const strength=.18+velocity*1.6;
        for(let y=0;y<e.gh;y++)for(let x=0;x<e.gw;x++) {
          const i=y*e.gw+x,nx=x/e.gw,ny=y/e.gh;
          const sideways=Math.sin(nx*9+ny*4)*.62+
            Math.sin(nx*18-ny*7+1.8)*.29+
            Math.sin(nx*34+ny*11+.7)*.09;
          const verticalWave=Math.sin(nx*12+ny*5);
          e.vx[i]=sideways*strength*e.influence[i];
          e.vy[i]=-strength*(.8+.2*verticalWave)*e.influence[i];
        }
        e.velocity=velocity;e.lookupKey=null;
      }

      function warpBuildLookup(e, distortion, velocity) {
        const key=distortion+":"+velocity;
        if(e.lookupKey===key)return;
        const dt=.9+distortion*1.3;
        const {gw,gh,a,b,c,d,wa,wb,wc,wd,vx,vy}=e;
        for(let y=0;y<gh;y++)for(let x=0;x<gw;x++) {
          const i=y*gw+x;
          const bx=warpClamp(x-vx[i]*dt,0,gw-1);
          const by=warpClamp(y-vy[i]*dt,0,gh-1);
          const x0=Math.floor(bx),y0=Math.floor(by);
          const x1=Math.min(gw-1,x0+1),y1=Math.min(gh-1,y0+1);
          const tx=bx-x0,ty=by-y0;
          a[i]=y0*gw+x0;b[i]=y0*gw+x1;
          c[i]=y1*gw+x0;d[i]=y1*gw+x1;
          wa[i]=(1-tx)*(1-ty);wb[i]=tx*(1-ty);
          wc[i]=(1-tx)*ty;wd[i]=tx*ty;
        }
        e.lookupKey=key;
      }

      function warpAdvect(e) {
        const {n,a,b,c,d,wa,wb,wc,wd}=e;
        for(let i=0;i<n;i++) {
          const ia=a[i],ib=b[i],ic=c[i],id=d[i];
          const w0=wa[i],w1=wb[i],w2=wc[i],w3=wd[i];
          e.nextX[i]=e.mapX[ia]*w0+e.mapX[ib]*w1+e.mapX[ic]*w2+e.mapX[id]*w3;
          e.nextY[i]=e.mapY[ia]*w0+e.mapY[ib]*w1+e.mapY[ic]*w2+e.mapY[id]*w3;
        }
        let temp=e.mapX;e.mapX=e.nextX;e.nextX=temp;
        temp=e.mapY;e.mapY=e.nextY;e.nextY=temp;
      }

      // Render any resolution using the same 180-cell deformation field.
      // Output is filled in row batches to keep the interface responsive.
      function warpRenderRows(e, src, sw, sh, dst, dw, dh, yStart, yEnd) {
        const {gw,gh,mapX,mapY}=e;
        const sxScale=sw/gw,syScale=sh/gh;
        for(let y=yStart;y<yEnd;y++) {
          const gy=warpClamp((y+.5)*gh/dh-.5,0,gh-1);
          const y0=Math.floor(gy),y1=Math.min(gh-1,y0+1),ty=gy-y0;
          for(let x=0;x<dw;x++) {
            const gx=warpClamp((x+.5)*gw/dw-.5,0,gw-1);
            const x0=Math.floor(gx),x1=Math.min(gw-1,x0+1),tx=gx-x0;
            const a=y0*gw+x0,b=y0*gw+x1,c=y1*gw+x0,d=y1*gw+x1;
            const wa=(1-tx)*(1-ty),wb=tx*(1-ty),wc=(1-tx)*ty,wd=tx*ty;
            const mx=mapX[a]*wa+mapX[b]*wb+mapX[c]*wc+mapX[d]*wd;
            const my=mapY[a]*wa+mapY[b]*wb+mapY[c]*wc+mapY[d]*wd;
            const sx=warpClamp((mx+.5)*sxScale-.5,0,sw-1);
            const sy=warpClamp((my+.5)*syScale-.5,0,sh-1);
            const ix=Math.floor(sx),iy=Math.floor(sy);
            const jx=Math.min(sw-1,ix+1),jy=Math.min(sh-1,iy+1);
            const fx=sx-ix,fy=sy-iy;
            const p00=(iy*sw+ix)*4,p10=(iy*sw+jx)*4;
            const p01=(jy*sw+ix)*4,p11=(jy*sw+jx)*4;
            const w00=(1-fx)*(1-fy),w10=fx*(1-fy);
            const w01=(1-fx)*fy,w11=fx*fy;
            const o=(y*dw+x)*4;
            for(let k=0;k<3;k++)dst[o+k]=src[p00+k]*w00+src[p10+k]*w10+src[p01+k]*w01+src[p11+k]*w11;
            // Preserve source alpha at the output position (Warp 1.2 behavior).
            const alphaX=Math.min(sw-1,Math.floor((x+.5)*sw/dw));
            const alphaY=Math.min(sh-1,Math.floor((y+.5)*sh/dh));
            dst[o+3]=src[(alphaY*sw+alphaX)*4+3];
          }
        }
      }

      function warpStart() {
        if(currentEffect!=="warp"||!sourceImage)return;
        if(!warpEngine)warpEngine=warpMakeEngine();
        const e=warpEngine;
        if(!e)return;
        const mode=warpMode,distortion=warpDistortion/100,velocity=warpVelocity/100;
        const key=warpSourceVersion+":"+mode+":"+distortion+":"+velocity;
        if(key===warpRenderedKey) {
          // Switching back to Warp must repaint the cached result immediately.
          p.redraw();
          return;
        }
        if(key===warpWorkingKey)return;
        const job=++warpJobId;
        warpWorkingKey=key;
        warpBuildMask(e,mode);
        warpBuildVelocity(e,velocity);
        warpBuildLookup(e,distortion,velocity);
        e.mapX.set(e.baseX);e.mapY.set(e.baseY);
        const steps=distortion===0?0:Math.round(2+distortion*26);
        let step=0;
        const work=()=>{
          if(job!==warpJobId)return;
          for(let i=0;i<3&&step<steps;i++,step++)warpAdvect(e);
          if(step<steps){requestAnimationFrame(work);return;}
          const result=e.ctx.createImageData(e.w,e.h);
          if(distortion===0) {
            result.data.set(e.pixels);
            e.ctx.putImageData(result,0,0);
            warpPreviewCanvas=e.canvas;
            warpRenderedKey=key;
            warpWorkingKey=null;
            if(currentEffect==="warp")p.redraw();
            return;
          }
          let row=0;
          const render=()=>{
            if(job!==warpJobId)return;
            const end=Math.min(e.h,row+24);
            warpRenderRows(e,e.pixels,e.w,e.h,result.data,e.w,e.h,row,end);
            row=end;
            if(row<e.h){requestAnimationFrame(render);return;}
            e.ctx.putImageData(result,0,0);
            warpPreviewCanvas=e.canvas;
            warpRenderedKey=key;
            warpWorkingKey=null;
            if(currentEffect==="warp")p.redraw();
          };
          requestAnimationFrame(render);
        };
        requestAnimationFrame(work);
        p.redraw();
      }

      function drawWarp() {
        if(warpPreviewCanvas){
          p.drawingContext.drawImage(warpPreviewCanvas,offsetX,offsetY,displayWidth,displayHeight);
        }else{
          p.image(sourceImage,offsetX,offsetY,displayWidth,displayHeight);
        }
      }

      function exportWarp() {
        if(warpExporting||!sourceImage)return;
        // If a new result is still calculating, wait until it is complete.
        const desired=warpSourceVersion+":"+warpMode+":"+(warpDistortion/100)+":"+(warpVelocity/100);
        if(warpRenderedKey!==desired){
          warpStart();
          const check=()=>{
            if(currentEffect!=="warp")return;
            if(warpRenderedKey===desired)exportWarp();
            else if(warpWorkingKey===desired)requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
          return;
        }
        const e=warpEngine;
        if(warpDistortion===0) {
          p.save(sourceImage,"warp.png");
          return;
        }
        const sw=sourceImage.width,sh=sourceImage.height;
        const out=document.createElement("canvas");
        out.width=sw;out.height=sh;
        const ctx=out.getContext("2d",{willReadFrequently:true});
        const result=ctx.createImageData(sw,sh);
        const src=sourceImage.pixels;
        let row=0;
        warpExporting=true;
        downloadButton.disabled=true;
        const batch=()=>{
          const end=Math.min(sh,row+Math.max(4,Math.floor(25000/sw)));
          warpRenderRows(e,src,sw,sh,result.data,sw,sh,row,end);
          row=end;
          if(row<sh){requestAnimationFrame(batch);return;}
          ctx.putImageData(result,0,0);
          out.toBlob(blob=>{
            warpExporting=false;
            downloadButton.disabled=false;
            if(!blob)return;
            const url=URL.createObjectURL(blob);
            const a=document.createElement("a");
            a.href=url;a.download="warp.png";
            document.body.appendChild(a);a.click();a.remove();
            setTimeout(()=>URL.revokeObjectURL(url),10000);
          },"image/png");
        };
        requestAnimationFrame(batch);
      }


      /* MELT 2.3 — original row mapping and noise, unchanged */
function meltClamp(value, minValue, maxValue) {
  return Math.max(
    minValue,
    Math.min(maxValue, value)
  );
}

function meltSmoothstep(a, b, value) {
  const t = meltClamp(
    (value - a) / (b - a),
    0,
    1
  );

  return t * t * (3 - 2 * t);
}


// ------------------------------------
// DETERMINISTIC NOISE
// ------------------------------------

function meltHash(n) {
  const v =
    Math.sin(n * 127.1 + 311.7) *
    43758.5453;

  return v - Math.floor(v);
}

function meltNoise1(t) {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);

  return (
    meltHash(i) * (1 - u) +
    meltHash(i + 1) * u
  );
}


function meltBuildRowMap(w, h, positionValue, radiusValue, distortionValue) {
  const meltRowX = new Float32Array(h);
  const meltRowY = new Float32Array(h);

  const position =
    positionValue / 100;

  const radius =
    radiusValue / 100;

  // Melt 2.3:
  // Stronger sensitivity at low values.
  // Maximum strength remains unchanged.

  const distortion = Math.pow(
    distortionValue / 100,
    0.56
  );

  const center = position * (h - 1);

  const extent = Math.max(
    8,
    h * (0.06 + radius * 0.94)
  );

  // Original broad deformation strengths.

  const horizontalStrength =
    w *
    (
      0.006 +
      0.075 * Math.pow(distortion, 1.12)
    );

  const verticalStrength =
    h *
    (
      0.004 +
      0.09 * Math.pow(distortion, 1.25)
    );

  // Fine vibration.

  const fineJitterStrength =
    w *
    0.0075 *
    Math.pow(distortion, 1.15);

  // Localized mechanical shifts.

  const microShiftStrength =
    w *
    0.012 *
    Math.pow(distortion, 1.25);

  let accumulatedY = 0;

  for (let y = 0; y < h; y++) {
    const relative = (y - center) / extent;

    let envelope = 0;

    if (relative >= 0) {
      const fade =
        1 - meltSmoothstep(
          0.65,
          1.0,
          relative
        );

      const onset = meltSmoothstep(
        0.0,
        0.055,
        relative
      );

      envelope = onset * fade;
    }

    // --------------------------------
    // BROAD HORIZONTAL MOVEMENT
    // --------------------------------

    const broad =
      (
        meltNoise1(y * 0.009 + 13.2) *
        2 - 1
      ) * 0.58;

    const medium =
      (
        meltNoise1(y * 0.032 + 74.8) *
        2 - 1
      ) * 0.31;

    const fine =
      (
        meltNoise1(y * 0.12 + 191.4) *
        2 - 1
      ) * 0.11;

    // Irregular activity patches.

    const activity = meltSmoothstep(
      0.22,
      0.78,
      meltNoise1(y * 0.017 + 51.7)
    );

    const activityWeight =
      0.35 + 0.65 * activity;

    const broadOffset =
      envelope *
      horizontalStrength *
      (broad + medium + fine) *
      activityWeight;

    // --------------------------------
    // FINE JITTER
    // --------------------------------

    const jitterA =
      meltNoise1(
        y * 0.43 + 243.8
      ) * 2 - 1;

    const jitterB =
      meltNoise1(
        y * 0.91 + 618.4
      ) * 2 - 1;

    const jitter =
      jitterA * 0.72 +
      jitterB * 0.28;

    const jitterActivity =
      meltSmoothstep(
        0.25,
        0.75,
        meltNoise1(
          y * 0.026 + 144.7
        )
      );

    const fineJitter =
      envelope *
      fineJitterStrength *
      jitter *
      jitterActivity;

    // --------------------------------
    // MICRO SHIFTS
    // --------------------------------

    const shiftGate =
      meltSmoothstep(
        0.73,
        0.92,
        meltNoise1(
          y * 0.065 + 901.3
        )
      );

    const shiftDirection =
      meltNoise1(
        y * 0.018 + 712.6
      ) * 2 - 1;

    const microShift =
      envelope *
      microShiftStrength *
      shiftGate *
      shiftDirection;

    // Final horizontal displacement.

    meltRowX[y] =
      broadOffset +
      fineJitter +
      microShift;

    // --------------------------------
    // VERTICAL SCAN DRAG
    // --------------------------------

    const slow =
      meltNoise1(
        y * 0.012 + 328.6
      ) * 2 - 1;

    const mid =
      meltNoise1(
        y * 0.045 + 817.2
      ) * 2 - 1;

    const scanVariation =
      slow * 0.72 +
      mid * 0.28;

    const localSpeed =
      1 +
      envelope *
      distortion *
      (0.65 + activity * 1.1) *
      scanVariation *
      0.88;

    accumulatedY += localSpeed - 1;

    const drag =
      envelope *
      verticalStrength *
      (
        meltNoise1(
          y * 0.018 + 417.1
        ) * 2 - 1
      );

    const sourceY =
      y + accumulatedY + drag;

    meltRowY[y] = meltClamp(
      sourceY,
      0,
      h - 1
    );
  }
  return { x: meltRowX, y: meltRowY };
}



      function meltKey() {
        return [sourceImage ? sourceImage.width + "x" + sourceImage.height : "none",
          meltPositionSlider.value, meltRadiusSlider.value, meltDistortionSlider.value].join(":");
      }

      function meltPrepare() {
        meltJob++;
        meltReadyKey = null;
        meltPendingKey = null;
        meltPreview = null;
        meltResult = null;
        if (!sourceImage) return;
        const ratio = Math.min(1, MELT_MAX_PREVIEW / Math.max(sourceImage.width, sourceImage.height));
        const w = Math.max(1, Math.round(sourceImage.width * ratio));
        const h = Math.max(1, Math.round(sourceImage.height * ratio));
        meltPreview = sourceImage.get();
        if (w !== sourceImage.width || h !== sourceImage.height) meltPreview.resize(w, h);
        meltPreview.loadPixels();
        meltResult = p.createImage(w, h);
        meltResult.loadPixels();
        meltPixels = meltPreview.pixels;
        meltDestination = meltResult.pixels;
      }

      function meltRenderRows(src, dst, w, h, mapX, mapY, from, to) {
        const stride = w * 4;
        const maxX = w - 1;
        const maxY = h - 1;
        for (let y = from; y < to; y++) {
          const shiftX = mapX[y];
          const sourceY = mapY[y];
          const sy0 = Math.floor(sourceY);
          const sy1 = Math.min(maxY, sy0 + 1);
          const fy = sourceY - sy0;
          const invFy = 1 - fy;
          const row0 = sy0 * stride;
          const row1 = sy1 * stride;
          const outRow = y * stride;
          for (let x = 0; x < w; x++) {
            let sourceX = x - shiftX;
            if (sourceX < 0) sourceX = 0;
            else if (sourceX > maxX) sourceX = maxX;
            const sx0 = Math.floor(sourceX);
            const sx1 = Math.min(maxX, sx0 + 1);
            const fx = sourceX - sx0;
            const invFx = 1 - fx;
            const wa = invFx * invFy, wb = fx * invFy;
            const wc = invFx * fy, wd = fx * fy;
            const i00 = row0 + sx0 * 4, i10 = row0 + sx1 * 4;
            const i01 = row1 + sx0 * 4, i11 = row1 + sx1 * 4;
            const out = outRow + x * 4;
            dst[out] = src[i00] * wa + src[i10] * wb + src[i01] * wc + src[i11] * wd;
            dst[out+1] = src[i00+1] * wa + src[i10+1] * wb + src[i01+1] * wc + src[i11+1] * wd;
            dst[out+2] = src[i00+2] * wa + src[i10+2] * wb + src[i01+2] * wc + src[i11+2] * wd;
            dst[out+3] = src[i00+3] * wa + src[i10+3] * wb + src[i01+3] * wc + src[i11+3] * wd;
          }
        }
      }

      function meltStart() {
        if (currentEffect !== "melt" || !sourceImage) return;
        if (!meltPreview) meltPrepare();
        const key = meltKey();
        if (key === meltReadyKey) { p.redraw(); return; }
        if (key === meltPendingKey) return;
        const job = ++meltJob;
        meltPendingKey = key;
        const distortion = Number(meltDistortionSlider.value);
        if (distortion === 0) {
          meltReadyKey = key;
          meltPendingKey = null;
          p.redraw();
          return;
        }
        const w = meltPreview.width, h = meltPreview.height;
        const map = meltBuildRowMap(w, h, Number(meltPositionSlider.value),
          Number(meltRadiusSlider.value), distortion);
        meltMapX = map.x;
        meltMapY = map.y;
        meltRenderY = 0;
        p.redraw();
        const batch = () => {
          if (job !== meltJob || currentEffect !== "melt") return;
          const end = Math.min(h, meltRenderY + MELT_ROWS_PER_FRAME);
          meltRenderRows(meltPixels, meltDestination, w, h, meltMapX, meltMapY, meltRenderY, end);
          meltRenderY = end;
          if (end < h) { requestAnimationFrame(batch); return; }
          meltResult.updatePixels();
          meltReadyKey = key;
          meltPendingKey = null;
          p.redraw();
        };
        requestAnimationFrame(batch);
      }

      function drawMelt() {
        const result = Number(meltDistortionSlider.value) === 0 ||
          meltReadyKey !== meltKey() ? sourceImage : meltResult;
        if (result) p.image(result, offsetX, offsetY, displayWidth, displayHeight);
      }

      function exportMelt() {
        if (!sourceImage || meltExporting) return;
        const distortion = Number(meltDistortionSlider.value);
        if (distortion === 0) { p.save(sourceImage, "melt.png"); return; }
        const w = sourceImage.width, h = sourceImage.height;
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d", {willReadFrequently:true});
        const imageData = ctx.createImageData(w, h);
        // Preserve the preview's distortion pattern at original resolution.
        // Interpolate its row map rather than changing noise frequencies with image size.
        const pw = meltPreview.width, ph = meltPreview.height;
        const previewMap = meltBuildRowMap(pw, ph, Number(meltPositionSlider.value),
          Number(meltRadiusSlider.value), distortion);
        const map = {x: new Float32Array(h), y: new Float32Array(h)};
        for (let y = 0; y < h; y++) {
          const py = h > 1 ? y * (ph - 1) / (h - 1) : 0;
          const a = Math.floor(py), b = Math.min(ph - 1, a + 1), t = py - a;
          map.x[y] = (previewMap.x[a] * (1 - t) + previewMap.x[b] * t) * w / pw;
          map.y[y] = (previewMap.y[a] * (1 - t) + previewMap.y[b] * t) * (h - 1) / Math.max(1, ph - 1);
        }
        sourceImage.loadPixels();
        const src = sourceImage.pixels;
        let row = 0;
        meltExporting = true;
        downloadButton.disabled = true;
        const batch = () => {
          const end = Math.min(h, row + Math.max(4, Math.floor(30000 / w)));
          meltRenderRows(src, imageData.data, w, h, map.x, map.y, row, end);
          row = end;
          if (row < h) { requestAnimationFrame(batch); return; }
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob(blob => {
            meltExporting = false;
            downloadButton.disabled = false;
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "melt.png";
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          }, "image/png");
        };
        requestAnimationFrame(batch);
      }

      /* RESIZE */

      function resizeToTool() {

        syncControlsWidth();
        updateMobileLayout();

        const size =
          getToolSize();

        if (
          size.width === p.width &&
          size.height === p.height
        ) {
          return;
        }

        p.resizeCanvas(
          size.width,
          size.height
        );

        if (sourceImage) {

          prepareDisplay();

        }

        if (currentEffect === "warp") {
          warpStart();
        }
        else if (currentEffect === "melt") {
          meltStart();
        }
        else if (currentEffect === "wave" || currentEffect === "slice") {
          p.redraw();
        }

      }


      /* RESIZE OBSERVER */

      if (
        typeof ResizeObserver !==
        "undefined"
      ) {

        const resizeObserver =
          new ResizeObserver(
            function () {

              resizeToTool();

            }
          );

        resizeObserver.observe(
          tool
        );

      }


      window.addEventListener(
        "resize",
        resizeToTool
      );


    }, container);

  }


  /* LOAD P5 */

  if (window.p5) {

    startSketch();

  }

  else {

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js";

    script.onload =
      startSketch;

    document.head.appendChild(
      script
    );

  }

})();

/* Send cursor coordinates to Readymag */

(function () {
  if (window.parent === window) {
    return;
  }

  document.addEventListener("mousemove", function (event) {
    window.parent.postMessage(
      {
        type: "displacement-cursor",
        x: event.clientX,
        y: event.clientY
      },
      "https://dariiachert.com"
    );
  }, { passive: true });
})();
