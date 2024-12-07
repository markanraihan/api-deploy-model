const admin = require('firebase-admin');
const path = require('path');
const crypto = require('crypto');
const predictClassification = require("../services/inferenceServices");
const storeData = require("../services/storeData");

// Firebase Admin SDK initialization
const pathKey =  path.resolve(__dirname, '../firestore/submissionmlgc-arkan-444003-be67542ef691.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(pathKey)),
  });
}
const db = admin.firestore();

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { confidenceScore, label, suggestion } = await predictClassification(
    model,
    image
  );
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message:
      confidenceScore > 99 ? "Model is predicted successfully" : "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

async function predictHistories(request, h) {
  const predictCollection = db.collection("predictions");
  try {
    const snapshot = await predictCollection.get();
    const result = snapshot.docs.map(doc => ({
      id: doc.id,
      history: doc.data(),
    }));

    return h.response({
      status: "success",
      data: result,
    }).code(200);
  } catch (error) {
    console.error("Error fetching prediction histories:", error);
    return h.response({
      status: "fail",
      message: error.message,
    }).code(500);
  }
}

async function testFirestoreConnection(request, h) {
  try {
    const snapshot = await db.collection("predictions").limit(1).get();
    if (snapshot.empty) {
      return h.response({
        status: "fail",
        message: "No documents found in predictions collection.",
      }).code(404);
    }

    return h.response({
      status: "success",
      message: "Firestore connection is working.",
    }).code(200);
  } catch (error) {
    console.error("Error testing Firestore connection:", error);
    return h.response({
      status: "fail",
      message: error.message,
    }).code(500);
  }
}

module.exports = { postPredictHandler, predictHistories, testFirestoreConnection };
