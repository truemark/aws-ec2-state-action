import {getInput} from '@actions/core'

export function required(value: string | undefined | null): string {
  if (!value) throw new Error('Required input is missing')
  return value
}

export function requiredValues(value: string, allowedValues: string[]): string {
  if (!allowedValues.includes(value)) throw new Error(`Invalid value for input: ${value}`)
  return value
}

export function optionalNumber(value: string): number | undefined {
  if (!value) return undefined
  return parseInt(value, 10)
}

export function optionalBoolean(value: string): boolean | undefined {
  if (!value) return undefined
  return value === 'true'
}

export function optionalJson<T>(value: string): T | undefined {
  if (!value) return undefined
  return JSON.parse(value) as T
}

export function optionalValues(value: string, allowedValues: string[]): string | undefined {
  if (!value) return undefined
  if (!allowedValues.includes(value)) throw new Error(`Invalid value for input: ${value}`)
  return value
}

export function undefinedIfEmpty(value: string): string | undefined {
  if (!value || value === '') return undefined
  return value
}

export interface Config {
  region: string
  instanceIds: string[]
  action: string
}

export function loadConfig(): Config {
  return {
    region: required(getInput('region')),
    instanceIds: required(getInput('instance-ids'))
      .split(',')
      .map(id => id.trim()),
    action: requiredValues(getInput('action'), ['start', 'stop', 'reboot', 'hibernate', 'terminate'])
  }
}
