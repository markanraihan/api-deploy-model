const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel("hhttps://storage.googleapis.com/ark-models-bucket/model-in-prod/model.json");
}
module.exports = loadModel;
