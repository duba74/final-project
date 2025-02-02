import database, {
    trainingEventCollection,
    trainingModuleCollection,
    villageCollection,
    clientCollection,
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

export const addTrainingModule = async (
    name = "m1",
    topic = "Composting",
    startDate = new Date("2012-02-10T13:19:11+0000").getTime(),
    endDate = new Date("2012-04-10T13:19:11+0000").getTime()
) => {
    await database.write(async () => {
        await trainingModuleCollection.create((m) => {
            m.name = name;
            m.topic = topic;
            m.startDate = startDate;
            m.endDate = endDate;
        });
    });
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
