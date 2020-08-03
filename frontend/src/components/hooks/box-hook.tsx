import { useEffect } from 'react'
import * as tf from '@tensorflow/tfjs';
import { useDimension } from './dimension-hook';

const SCORE_DIGITS = 4

const getLabelText = (prediction) => {
    const scoreText = prediction.score.toFixed(SCORE_DIGITS)
    return prediction.class + ', score: ' + scoreText
}

const calculateMaxScores = (scores, numBoxes, numClasses) => {
  const maxes = []
  const classes = []
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE
    let index = -1
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j]
        index = j
      }
    }
    maxes[i] = max
    classes[i] = index
  }
  return [maxes, classes]
}

const buildDetectedObjects = (
  width,
  height,
  boxes,
  scores,
  indexes,
  classes,
  labels
) => {
  const count = indexes.length
  const objects = []
  for (let i = 0; i < count; i++) {
    const bbox = []
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indexes[i] * 4 + j]
    }
    const minY = bbox[0] * height
    const minX = bbox[1] * width
    const maxY = bbox[2] * height
    const maxX = bbox[3] * width
    bbox[0] = minX
    bbox[1] = minY
    bbox[2] = maxX - minX
    bbox[3] = maxY - minY
    objects.push({
      bbox: bbox,
      class: labels[parseInt(classes[indexes[i]])],
      score: scores[indexes[i]]
    })
  }
  return objects
}

const renderPredictions = (predictions, canvasRef) => {
  const ctx = canvasRef.current.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // Font options.
  const font = '16px sans-serif'
  ctx.font = font
  ctx.textBaseline = 'top'
  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const width = prediction.bbox[2]
    const height = prediction.bbox[3]
    // console.log(x, y, width, height)
    // Draw the bounding box.
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    // Draw the label background.
    ctx.fillStyle = '#00FFFF'
    const textWidth = ctx.measureText(getLabelText(prediction)).width
    const textHeight = parseInt(font, 10) // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
  })

  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = '#000000'
    ctx.fillText(getLabelText(prediction), x, y)
  })
}

const detectFrame = async (model, videoRef, canvasRef, labels, dimensions) => {
  try {
    // console.log(videoRef.current.width, videoRef.current.height)
    const batched = tf.tidy(() => {
      const img = tf.browser.fromPixels(videoRef.current)
      const small = tf.image.resizeBilinear(img, [dimensions.height, dimensions.width])
      // Reshape to a single-element batch so we can pass it to executeAsync.
      return small.expandDims(0).toInt();
    })

    const height = batched.shape[1]
    const width = batched.shape[2]

    const result = await model.executeAsync(batched)
    const scores = result[0].dataSync();
    const boxes = result[1].dataSync()

    // clean the webgl tensors
    batched.dispose();
    tf.dispose(result);
    const [maxScores, classes] = calculateMaxScores(
      scores,
      result[0].shape[1],
      result[0].shape[2]
    )

    const prevBackend = tf.getBackend()
    // run post process in cpu
    tf.setBackend('cpu')
    const indexTensor = tf.tidy(() => {
      const boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[3]])
      return tf.image.nonMaxSuppression(
        boxes2,
        maxScores,
        20, // maxNumBoxes
        0.5, // iou_threshold
        0.5 // score_threshold
      )
    })

    const indexes = indexTensor.dataSync()
    indexTensor.dispose()
    // restore previous backend
    tf.setBackend(prevBackend)

    const predictions = buildDetectedObjects(
      width,
      height,
      boxes,
      maxScores,
      indexes,
      classes,
      labels
    )

    renderPredictions(predictions, canvasRef)
      
    requestAnimationFrame(() => {
      detectFrame(model, videoRef, canvasRef, labels, dimensions)
    })
  } catch(err) {
      console.log(err)
  }
}

const useBoxRenderer = (model, videoRef, canvasRef, shouldRender, labels) => {
  const dimensions = useDimension();
  console.log(model && labels && shouldRender)

  useEffect(() => {
    if (model && labels && shouldRender) {
        console.log(model && labels && shouldRender)
      console.log("new video");
      detectFrame(model, videoRef, canvasRef, labels, dimensions)
    }
  }, [canvasRef, model, shouldRender, videoRef, labels, dimensions])
}

export default useBoxRenderer