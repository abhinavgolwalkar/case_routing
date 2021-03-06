# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""`gcloud iot credentials delete` command."""
from googlecloudsdk.api_lib.cloudiot import devices
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.iot import flags
from googlecloudsdk.command_lib.iot import util
from googlecloudsdk.core import log
from googlecloudsdk.core.console import console_io


class Delete(base.DeleteCommand):
  """Delete a credential from a device."""

  @staticmethod
  def Args(parser):
    flags.AddDeviceResourceFlags(parser, 'from which to delete credentials',
                                 positional=False)
    flags.GetIndexFlag('credential', 'to delete').AddToParser(parser)

  def Run(self, args):
    client = devices.DevicesClient()

    device_ref = util.ParseDevice(
        args.device, registry=args.registry, region=args.region)

    credentials = client.Get(device_ref).credentials
    try:
      credential = credentials.pop(args.index)
    except IndexError:
      raise util.BadCredentialIndexError(device_ref.Name(), credentials,
                                         args.index)
    console_io.PromptContinue(
        message='This will delete the following credential: {}'.format(
            credential),
        cancel_on_no=True)
    response = client.Patch(device_ref, credentials=credentials)
    log.DeletedResource(device_ref.Name(), 'credentials for device')
    return response
