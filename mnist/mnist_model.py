import torch
import torch.nn as nn
import numpy as np

class LeNet(nn.Module):
    def __init__(self):
        super(LeNet, self).__init__()
        self.conv1 = nn.Sequential(
            nn.Conv2d(
                in_channels=1,
                out_channels=16,
                kernel_size=(20, 20)
            ),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(4, 4)),

            nn.Conv2d(16, 64, (20, 20)),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=(2, 2)),

            nn.Conv2d(64, 64, (2, 2)),
            nn.ReLU()
        )
        self.out = nn.Sequential(
            nn.Linear(576, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
            nn.Softmax(1)
        )

    def forward(self, x):
        x = self.conv1(x)
        x = x.view(x.size(0), -1)
        x = self.out(x)

        # print(x.shape)
        return x

def predict(img, net):

    #filter too bright or too dark
    cnt = np.count_nonzero(img)
    if cnt < 128*128*0.05 or 128*128*0.4 < cnt:
        # print(args,"nothing", cnt)
        return -1
    
    #change shape and type to match mnist input
    img = torch.Tensor([[img]])
    output = net(img.cuda())

    return int(torch.max(output, 1)[1])