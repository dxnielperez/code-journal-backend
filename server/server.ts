/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "entries"
    `;

    const result = await db.query(sql);
    const entries = result.rows;
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (typeof entryId !== 'number') {
      throw new ClientError(400, 'EntryId must be a number');
    }
    if (entryId < 1) {
      throw new ClientError(400, 'EntryId must be a positive number');
    }

    const sql = `
    select *
    from "entries"
    where "entryId" = $1
    `;
    const params = [entryId];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    insert into "entries" ("title", "notes", "photoUrl")
    values ($1, $2, $3)
    returning *;
    `;
    const { title, notes, photoUrl } = req.body;
    const params = [title, notes, photoUrl];
    if (!title) {
      throw new ClientError(400, 'Missing title');
    }
    if (!notes) {
      throw new ClientError(400, 'Missing notes');
    }
    if (!photoUrl) {
      throw new ClientError(400, 'Missing photoUrl');
    }
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const id = Number(entryId);
    console.log('entryId', entryId);
    if (typeof id !== 'number') {
      throw new ClientError(400, 'EntryId must be a number');
    }
    if (id < 1) {
      throw new ClientError(400, 'EntryId must be a positive number');
    }

    const sql = `
    update "entries"
    set "title" = $1,
        "notes" = $2,
        "photoUrl" = $3
    where "entryId" = $4
    returning *;
    `;
    const params = [req.body.title, req.body.notes, req.body.photoUrl, id];
    const result = await db.query(sql, params);
    const entry = result.rows[0];

    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;

    const id = Number(entryId);
    if (typeof id !== 'number') {
      throw new ClientError(400, 'EntryId must be a number');
    }
    if (id < 1) {
      throw new ClientError(400, 'EntryId must be a positive number');
    }

    const sql = `
    delete
    from "entries"
    where "entryId" = $1
    returning *;
    `;
    const params = [id];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    if (!entry) throw new ClientError(404, `entryId ${id} doesnt exist`);
    res.status(204).json(entry);
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
