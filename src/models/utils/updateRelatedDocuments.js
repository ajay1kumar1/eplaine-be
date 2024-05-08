const updateRelatedDocuments = async (Model, doc, relatedArrayString, previousRelated, localArrayString) => {
  // (Student, doc, 'parents', previousChildren, 'children');
  const { _id } = doc;
  const localArray = doc[localArrayString];

  const shouldRemoveAll = !previousRelated.length && localArray && !localArray.length;
  const shouldUpdatePreviousRelated = previousRelated.length;
  const addRelated = !previousRelated.length && localArray && localArray.length;

  if (shouldRemoveAll) {
    await Model.updateMany({ [relatedArrayString]: _id }, { $pull: { [relatedArrayString]: _id } });
    return;
  }

  if (shouldUpdatePreviousRelated) {
    const relatedToAdd = localArray.filter((relatedId) => !previousRelated.includes(relatedId));
    const relatedToRemove = previousRelated.filter((relatedId) => !localArray.includes(relatedId));

    if (relatedToRemove.length) {
      await Model.updateMany({ _id: { $in: relatedToRemove } }, { $pull: { [relatedArrayString]: _id } });
    }

    if (relatedToAdd.length) {
      await Model.updateMany({ _id: { $in: relatedToAdd } }, { $addToSet: { [relatedArrayString]: _id } });
    }
  }

  if (addRelated) {
    await Promise.all(
      localArray.map((relatedId) => Model.findByIdAndUpdate(relatedId, { $addToSet: { [relatedArrayString]: _id } }))
    );
  }
};

const updateRelatedDocumentsOnDeletion = async (Model, related, localArrayString, next) => {
  // don't extract this out of the function as schema won't be registered

  try {
    // Find all child documents that have the student ID in their children array
    const relatedDocuments = await Model.find({ [localArrayString]: related._id });

    // Remove the student ID from the children array of each child document
    await Model.updateMany(
      { _id: { $in: relatedDocuments.map((relatedDocument) => relatedDocument._id) } },
      { $pull: { [localArrayString]: related._id } }
    );
    next(); // Call next to proceed with the removal process
  } catch (error) {
    next(error); // Pass any error to the next middleware/hook
  }
};

module.exports = { updateRelatedDocuments, updateRelatedDocumentsOnDeletion };
