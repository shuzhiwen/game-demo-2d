import {Stack} from '@mui/material'
import {AUTO, Game, Math} from 'phaser'
import {useEffect, useRef} from 'react'
import {AppStage} from '../components/container'

export function Started() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current!
    const {width, height} = container.getBoundingClientRect()
    const [cx, cy] = [width / 2, height / 2]
    const game = new Game({
      type: AUTO,
      width: '100%',
      height: '100%',
      parent: container,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 300},
          debug: false,
        },
      },
      scene: {
        create: create(cx, cy),
        preload,
        update,
      },
    })
    return () => game.destroy(true, false)
  }, [])

  return (
    <AppStage>
      <Stack ref={ref} m="auto" width={800} height={600} />
    </AppStage>
  )
}

function preload(this: Phaser.Scene) {
  this.load.image('sky', 'image/sky.png')
  this.load.image('ground', 'image/platform.png')
  this.load.image('star', 'image/star.png')
  this.load.image('bomb', 'image/bomb.png')
  this.load.spritesheet('dude', 'image/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  })
}

const create = (cx: number, cy: number) => {
  return function (this: Phaser.Scene) {
    this.add.image(cx, cy, 'sky')

    let score = 0
    const platforms = this.physics.add.staticGroup()
    const player = this.physics.add.sprite(100, 450, 'dude')
    const cursors = this.input.keyboard?.createCursorKeys()
    const bombs = this.physics.add.group()
    const text = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      color: '#000',
    })
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70},
    })

    this.registry.set({platforms, player, cursors}, null)
    this.physics.add.collider(player, platforms)
    this.physics.add.collider(stars, platforms)
    this.physics.add.collider(bombs, platforms)

    this.physics.add.collider(
      player,
      bombs,
      () => {
        this.physics.pause()
        player.setTint(0xff0000)
        player.anims.play('turn')
      },
      undefined,
      this
    )

    this.physics.add.overlap(
      player,
      stars,
      (_, star: any) => {
        score += 10
        text.setText(`score: ${score}`)
        star.disableBody(true, true)

        if (stars.countActive(true) === 0) {
          stars.children.iterate((child: any) => {
            child.enableBody(true, child.x, 0, true, true)
            return null
          })

          const x =
            player.x < 400 ? Math.Between(400, 800) : Math.Between(0, 400)
          const bomb = bombs.create(x, 16, 'bomb')

          bomb.setBounce(1)
          bomb.setCollideWorldBounds(true)
          bomb.setVelocity(Math.Between(-200, 200), 20)
        }
      },
      undefined,
      this
    )

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()
    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1,
    })

    stars.children.iterate((child: any) => {
      child.setBounceY(Math.FloatBetween(0.4, 0.8))
      return null
    })
  }
}

function update(this: Phaser.Scene) {
  const {cursors, player} = this.registry.getAll()

  if (cursors.left.isDown) {
    player.setVelocityX(-160)
    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)
    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)
    player.anims.play('turn')
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330)
  }
}
