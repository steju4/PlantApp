import Database from 'better-sqlite3';

const db: Database.Database = new Database('database.db');

const createTable = (): void => {
    const sql: string = `CREATE TABLE IF NOT EXISTS dilemmatas( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pros JSON NOT NULL,
        cons JSON NOT NULL
                 )`;
    db.prepare(sql).run();
};

const insertTable = (): void => {
    const sql: string = `INSERT INTO dilemmatas(name, pros, cons) VALUES (?,?,?)`;
    db.prepare(sql).run('Standortwechsel', JSON.stringify([]), JSON.stringify([]));
};

const getDilemmata = (): void => {
    const sql: string = `SELECT pros FROM dilemmatas
                         WHERE dilemmatas.id = 5;`;
    const rows: any[] = db.prepare(sql).all();
    console.log(rows);
};

const getValues = (attribute: string, ID: number): any[] => {
    const sql: string = `
        SELECT ${attribute} FROM dilemmatas
        WHERE dilemmatas.id = ?;`;
    return db.prepare(sql).all(ID);
};

const addToTable = (ID: number, attribute: string, content: string): void => {
    const prev: any[] = JSON.parse(getValues(attribute, ID)[0][attribute]);
    console.log(prev);
    const sql: string = `
    UPDATE dilemmatas
    SET ${attribute} = ?
    WHERE id = ?`;

    prev.push({arg_id: prev.length, argument: content});

    db.prepare(sql).run(JSON.stringify(prev), ID);
};

const updateTable = (ID: number, attribute: string, arg_ID: number, newArgument: string): void => {
    const prev: any[] = JSON.parse(getValues(attribute, ID)[0][attribute]);

    prev.forEach(item => {
        if (item.arg_id === arg_ID) {
            item.argument = newArgument;
        }
    });

    const sql: string = `
    UPDATE dilemmatas
    SET ${attribute} = ?
    WHERE id = ?`;

    db.prepare(sql).run(JSON.stringify(prev), ID);

    console.log(prev);
};

export { createTable, getDilemmata, getValues, addToTable, updateTable, insertTable };
/*
createTable();
insertTable();
addToTable(90, "pros", "Deine mama isst")
updateTable(90, "pros", 0, "Dein Papa isst")*/
