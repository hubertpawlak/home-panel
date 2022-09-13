/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/temperature_sensors": {
    get: {
      parameters: {
        query: {
          hwId?: parameters["rowFilter.temperature_sensors.hwId"];
          temperature?: parameters["rowFilter.temperature_sensors.temperature"];
          resolution?: parameters["rowFilter.temperature_sensors.resolution"];
          updated_at?: parameters["rowFilter.temperature_sensors.updated_at"];
          created_at?: parameters["rowFilter.temperature_sensors.created_at"];
          name?: parameters["rowFilter.temperature_sensors.name"];
          updated_by?: parameters["rowFilter.temperature_sensors.updated_by"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["temperature_sensors"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** temperature_sensors */
          temperature_sensors?: definitions["temperature_sensors"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          hwId?: parameters["rowFilter.temperature_sensors.hwId"];
          temperature?: parameters["rowFilter.temperature_sensors.temperature"];
          resolution?: parameters["rowFilter.temperature_sensors.resolution"];
          updated_at?: parameters["rowFilter.temperature_sensors.updated_at"];
          created_at?: parameters["rowFilter.temperature_sensors.created_at"];
          name?: parameters["rowFilter.temperature_sensors.name"];
          updated_by?: parameters["rowFilter.temperature_sensors.updated_by"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          hwId?: parameters["rowFilter.temperature_sensors.hwId"];
          temperature?: parameters["rowFilter.temperature_sensors.temperature"];
          resolution?: parameters["rowFilter.temperature_sensors.resolution"];
          updated_at?: parameters["rowFilter.temperature_sensors.updated_at"];
          created_at?: parameters["rowFilter.temperature_sensors.created_at"];
          name?: parameters["rowFilter.temperature_sensors.name"];
          updated_by?: parameters["rowFilter.temperature_sensors.updated_by"];
        };
        body: {
          /** temperature_sensors */
          temperature_sensors?: definitions["temperature_sensors"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
}

export interface definitions {
  temperature_sensors: {
    /**
     * Format: text
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    hwId: string;
    /** Format: numeric */
    temperature?: number;
    /** Format: numeric */
    resolution?: number;
    /**
     * Format: timestamp with time zone
     * @default (now() AT TIME ZONE 'utc'::text)
     */
    updated_at: string;
    /**
     * Format: timestamp with time zone
     * @default (now() AT TIME ZONE 'utc'::text)
     */
    created_at: string;
    /** Format: text */
    name?: string;
    /** Format: text */
    updated_by?: string;
  };
}

export interface parameters {
  /**
   * @description Preference
   * @enum {string}
   */
  preferParams: "params=single-object";
  /**
   * @description Preference
   * @enum {string}
   */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /**
   * @description Preference
   * @enum {string}
   */
  preferCount: "count=none";
  /** @description Filtering Columns */
  select: string;
  /** @description On Conflict */
  on_conflict: string;
  /** @description Ordering */
  order: string;
  /** @description Limiting and Pagination */
  range: string;
  /**
   * @description Limiting and Pagination
   * @default items
   */
  rangeUnit: string;
  /** @description Limiting and Pagination */
  offset: string;
  /** @description Limiting and Pagination */
  limit: string;
  /** @description temperature_sensors */
  "body.temperature_sensors": definitions["temperature_sensors"];
  /** Format: text */
  "rowFilter.temperature_sensors.hwId": string;
  /** Format: numeric */
  "rowFilter.temperature_sensors.temperature": string;
  /** Format: numeric */
  "rowFilter.temperature_sensors.resolution": string;
  /** Format: timestamp with time zone */
  "rowFilter.temperature_sensors.updated_at": string;
  /** Format: timestamp with time zone */
  "rowFilter.temperature_sensors.created_at": string;
  /** Format: text */
  "rowFilter.temperature_sensors.name": string;
  /** Format: text */
  "rowFilter.temperature_sensors.updated_by": string;
}

export interface operations {}

export interface external {}