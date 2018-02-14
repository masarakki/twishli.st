.PHONY: all

SRCS = template.yml handler.js
OBJS = tmp/packaged.yml

default: all

tmp/packaged.yml: $(SRCS)
	sam package --template-file template.yml --s3-bucket twishlist-deploy --output-template-file tmp/packaged.yml

tmp/deployed: $(OBJS)
	sam deploy --template-file tmp/packaged.yml --stack-name twishlist --capabilities CAPABILITY_IAM
	touch tmp/deployed

all: tmp/deployed

.PHONY: clean
clean:
	rm $(OBJS)

start:
	sam local start-api --env-vars .env.development.json
