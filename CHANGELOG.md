# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.0.2](https://github.com/hubertpawlak/home-panel/compare/v4.0.1...v4.0.2) (2023-07-11)


### Bug Fixes

* Added missing type ([ac68212](https://github.com/hubertpawlak/home-panel/commit/ac68212eedbb7ae18f069b8d3a9af9bb94648b0d))

### [4.0.1](https://github.com/hubertpawlak/home-panel/compare/v4.0.0...v4.0.1) (2023-07-11)

## [4.0.0](https://github.com/hubertpawlak/home-panel/compare/v3.1.1...v4.0.0) (2023-07-02)


### ⚠ BREAKING CHANGES

* Edge Config values are no longer used, everything is stored in Redis

### Features

* Dynamic configuration with Redis ([1283efc](https://github.com/hubertpawlak/home-panel/commit/1283efc41d2a2d2e143112d592101af36a1c293b))
* Switch from Edge Config to Upstash ([c2762c2](https://github.com/hubertpawlak/home-panel/commit/c2762c29f25ad03d00bb5bed7a6176aa343a5010))


### Bug Fixes

* Disable Supabase server session persistence ([50f6784](https://github.com/hubertpawlak/home-panel/commit/50f6784fcbb21362f6540f369c36438bcd5d42ee))

### [3.1.1](https://github.com/hubertpawlak/home-panel/compare/v3.1.0...v3.1.1) (2023-05-05)


### Bug Fixes

* Removed unnecessary getStaticProps ([092a9a0](https://github.com/hubertpawlak/home-panel/commit/092a9a04b1ffa5e923be48f753e816b972d9a3df))
* SuperTokens changed UI route handling ([c5ca244](https://github.com/hubertpawlak/home-panel/commit/c5ca24499025b8d7372b1e18a5e68d6e205b1463))

## [3.1.0](https://github.com/hubertpawlak/home-panel/compare/v3.0.2...v3.1.0) (2023-05-05)


### Features

* Generate attribution page ([430a0b1](https://github.com/hubertpawlak/home-panel/commit/430a0b11aa3fae141c8a95aa572e4190ae96e00d))


### Bug Fixes

* Handle getEdgeConfigValues edge case ([6d4ee2e](https://github.com/hubertpawlak/home-panel/commit/6d4ee2ee2437e9819233b93ddb1b4e7ea3a7ab39))

### [3.0.2](https://github.com/hubertpawlak/home-panel/compare/v3.0.1...v3.0.2) (2023-05-02)


### Bug Fixes

* Changed copyright year ([c8e37c1](https://github.com/hubertpawlak/home-panel/commit/c8e37c182262566b97e906b57c6beddc88fc8b6a))
* Changed Text to Title ([6d0601e](https://github.com/hubertpawlak/home-panel/commit/6d0601e0c7b6194f9cd67a582e5b8a1e96bd2802))

### [3.0.1](https://github.com/hubertpawlak/home-panel/compare/v3.0.0...v3.0.1) (2023-05-02)


### Bug Fixes

* Compilation error because of wrong Icon name ([8fa43be](https://github.com/hubertpawlak/home-panel/commit/8fa43be6bb50da5942d065139ebc5b095520be0c))

## [3.0.0](https://github.com/hubertpawlak/home-panel/compare/v2.2.1...v3.0.0) (2023-05-01)


### ⚠ BREAKING CHANGES

* "m2m.storeTemperatures" no longer exists, switch to UDS instead
* "sensors" table will be lost after database migration

### Features

* Added support for universal-data-source ([b227b53](https://github.com/hubertpawlak/home-panel/commit/b227b5380ac1420f56f1a61c2656b2298a26796a))


### Bug Fixes

* TemperatureSensor getColor type ([af34ff7](https://github.com/hubertpawlak/home-panel/commit/af34ff70a37bdd608a394201040715b478007b31))
