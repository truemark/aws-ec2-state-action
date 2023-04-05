import * as core from '@actions/core'
import {
  EC2Client,
  RebootInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand
} from '@aws-sdk/client-ec2'
import {loadConfig} from './config'

async function terminateInstance(ec2Client: EC2Client, instanceId: string): Promise<void> {
  const command = new TerminateInstancesCommand({
    InstanceIds: [instanceId]
  })
  const output = await ec2Client.send(command)
  if (output.TerminatingInstances === undefined || output.TerminatingInstances.length === 0) {
    throw new Error(`Failed to terminate instance ${instanceId}`)
  }
}

async function startInstance(ec2Client: EC2Client, instanceId: string): Promise<void> {
  const command = new StartInstancesCommand({
    InstanceIds: [instanceId]
  })
  const output = await ec2Client.send(command)
  if (output.StartingInstances === undefined || output.StartingInstances.length === 0) {
    throw new Error(`Failed to start instance ${instanceId}`)
  }
}

async function stopInstance(ec2Client: EC2Client, instanceId: string): Promise<void> {
  const command = new StopInstancesCommand({
    InstanceIds: [instanceId]
  })
  const output = await ec2Client.send(command)
  if (output.StoppingInstances === undefined || output.StoppingInstances.length === 0) {
    throw new Error(`Failed to stop instance ${instanceId}`)
  }
}

async function rebootInstance(ec2Client: EC2Client, instanceId: string): Promise<void> {
  const command = new RebootInstancesCommand({
    InstanceIds: [instanceId]
  })
  await ec2Client.send(command)
}

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    const ec2Client = new EC2Client({region: config.region})
    if (config.action === 'terminate') {
      await Promise.all(config.instanceIds.map(async instanceId => terminateInstance(ec2Client, instanceId)))
    }
    if (config.action === 'start') {
      await Promise.all(config.instanceIds.map(async instanceId => startInstance(ec2Client, instanceId)))
    }
    if (config.action === 'stop') {
      await Promise.all(config.instanceIds.map(async instanceId => stopInstance(ec2Client, instanceId)))
    }
    if (config.action === 'reboot') {
      await Promise.all(config.instanceIds.map(async instanceId => rebootInstance(ec2Client, instanceId)))
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
