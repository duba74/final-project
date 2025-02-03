import database, {
    trainingEventCollection,
    trainingModuleCollection,
    villageCollection,
    clientCollection,
    staffCollection,
    assignmentCollection,
} from "./database";

export const logRecords = async (collection: string) => {
    let data;

    switch (collection) {
        case "trainingModule":
            data = await trainingModuleCollection.query().fetch();
            break;

        case "trainingEvent":
            data = await trainingEventCollection.query().fetch();
            break;

        case "village":
            data = await villageCollection.query().fetch();
            break;

        case "client":
            data = await clientCollection.query().fetch();
            break;

        case "staff":
            data = await staffCollection.query().fetch();
            break;

        case "assignment":
            data = await assignmentCollection.query().fetch();
            break;

        default:
            break;
    }

    if (data) {
        if (data.length < 1) console.log("No records");

        data.forEach((e) => {
            console.log(JSON.stringify(e._raw, null, 4));
        });
    }
};

export const deleteAllRecordsFromTable = async (tableName: string) => {
    const collection = database.collections.get(tableName);

    const allRecords = await collection.query().fetch();

    const deleteOperations = allRecords.map((r) =>
        r.prepareDestroyPermanently()
    );

    await database.write(async () => {
        await database.batch(deleteOperations);
    });

    console.log(`All records have been deleted from the ${tableName}" table.`);
};
